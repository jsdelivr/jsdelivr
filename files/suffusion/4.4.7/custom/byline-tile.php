<?php
/**
 * Bylines for the Tile layout and the Magazine template. This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Users can override this in a child theme.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */
global $suffusion_byline_type, $suffusion_cpt_post_id;
if (!isset($suffusion_byline_type)) {
	$suffusion_byline_type = 'mag_excerpt';
}

$enabled = 'suf_' . $suffusion_byline_type . '_bylines_enabled';
if (isset($suffusion_cpt_post_id)) {
	$enabled = 'suf_cpt_show_tile_byline';
}

$date = 'suf_' . $suffusion_byline_type . '_bylines_post_date';
$permalinks = 'suf_' . $suffusion_byline_type . '_bylines_permalinks';
$posted_by = 'suf_' . $suffusion_byline_type . '_bylines_posted_by';
$comments = 'suf_' . $suffusion_byline_type . '_bylines_comments';
$cats = 'suf_' . $suffusion_byline_type . '_bylines_categories';
$tags = 'suf_' . $suffusion_byline_type . '_bylines_tags';

global $post, $$enabled, $$date, $$permalinks, $$posted_by, $$comments, $$cats, $$tags;
$bylines_enabled = $$enabled;
if (!$bylines_enabled ||$bylines_enabled == 'hide') {
	return '';
}
$show_post_date = $$date;
$show_permalinks = $$permalinks;
$show_posted_by = $$posted_by;
$show_comments = $$comments;
$show_cats = $$cats;
$show_tags = $$tags;

$ret = '';
echo "<div class='suf-tile-bylines fix'>\n";
echo "<ul class='suf-tile-byline-icons'>\n";
$ret_trailer = "<ul class='suf-tile-byline-texts'>\n";

if ($show_post_date && $show_post_date != 'hide') {
	$icon_a = "<a id='suf-tile-date-{$post->ID}' class='suf-tile-date-icon suf-tile-icon' href='#' title='" . __('Date', 'suffusion') . "'><span>&nbsp;</span></a>";
	echo "<li>$icon_a</li>\n";
	$ret_trailer .= "<li id='suf-tile-date-text-{$post->ID}' class='suf-tile-date-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>" . get_the_time(get_option('date_format')) . "</li>";
}

if ($show_permalinks && $show_permalinks != 'hide') {
	$permalink_text = apply_filters('suffusion_permalink_text', __('Permalink', 'suffusion'));
	$icon_a = "<a id='suf-tile-permalink-{$post->ID}' class='suf-tile-permalink-icon suf-tile-icon' href='#' title='$permalink_text'><span>&nbsp;</span></a>";
	echo "<li>$icon_a</li>\n";
	$ret_trailer .= "<li id='suf-tile-permalink-text-{$post->ID}' class='suf-tile-permalink-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>" . suffusion_get_post_title_and_link($permalink_text) . "</li>";
}

if ($show_posted_by && $show_posted_by != 'hide') {
	$icon_a = "<a id='suf-tile-postedby-{$post->ID}' class='suf-tile-postedby-icon suf-tile-icon' href='#' title='" . __('Author', 'suffusion') . "'><span>&nbsp;</span></a>";
	echo "<li>$icon_a</li>\n";
	$ret_trailer .= "<li id='suf-tile-postedby-text-{$post->ID}' class='suf-tile-postedby-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
	$ret_trailer .= suffusion_print_author_byline(false, false);
	$ret_trailer .= "</li>\n";
}

if ($show_comments && $show_comments != 'hide') {
	$icon_a = "<a id='suf-tile-comments-{$post->ID}' class='suf-tile-comments-icon suf-tile-icon' href='#' title='" . __('Responses', 'suffusion') . "'><span>&nbsp;</span></a>";
	echo "<li>$icon_a</li>\n";
	$ret_trailer .= "<li id='suf-tile-comments-text-{$post->ID}' class='suf-tile-comments-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
	ob_start(); // Output buffering is needed here because comments_popup_link doesn't have a getter that doesn't echo
	comments_popup_link(__('No Responses', 'suffusion'), __('1 Response', 'suffusion'), __('% Responses', 'suffusion'));
	$ret_trailer .= ob_get_contents();
	ob_end_clean();
	$ret_trailer .= "</li>\n";
}

if ($show_cats != 'hide') {
	$categories = get_the_category($post->ID);
	if (count($categories) != 0) {
		$icon_a = "<a id='suf-tile-cats-{$post->ID}' class='suf-tile-cats-icon suf-tile-icon' href='#' title='" . __('Categories', 'suffusion') . "'><span>&nbsp;</span></a>";
		echo "<li>$icon_a</li>\n";
		$ret_trailer .= "<li id='suf-tile-cats-text-{$post->ID}' class='suf-tile-cats-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
		$ret_trailer .= get_the_category_list(', ');
		$ret_trailer .= "</li>\n";
	}
}

if ($show_tags != 'hide') {
	$tags = get_the_tags($post->ID);
	if ($tags != '') {
		$icon_a = "<a id='suf-tile-tags-{$post->ID}' class='suf-tile-tags-icon suf-tile-tax-icon suf-tile-icon' href='#' title='" . __('Tags', 'suffusion') . "'><span>&nbsp;</span></a>";
		echo "<li>$icon_a</li>\n";
		$ret_trailer .= "<li id='suf-tile-tags-text-{$post->ID}' class='suf-tile-tags-icon-text suf-tile-tax-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
		$ret_trailer .= get_the_tag_list(__('Tagged with: ', 'suffusion'), ', ');
		$ret_trailer .= "</li>\n";
	}
}

if (isset($suffusion_cpt_post_id)) {
	$ret_trailer = apply_filters('suffusion_add_taxonomy_bylines_tile', $suffusion_cpt_post_id, $ret_trailer);
}

if (get_edit_post_link() != '') {
	$icon_a = "<a id='suf-tile-edit-{$post->ID}' class='suf-tile-edit-icon suf-tile-icon' href='#' title='" . __('Edit', 'suffusion') . "'><span>&nbsp;</span></a>";
	echo "<li>$icon_a</li>\n";
	$ret_trailer .= "<li id='suf-tile-edit-text-{$post->ID}' class='suf-tile-edit-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
	ob_start(); // Output buffering is needed here because edit_post_link doesn't have an easy getter that doesn't echo
	edit_post_link(__('Edit', 'suffusion'), '', '');
	$ret_trailer .= ob_get_contents();
	ob_end_clean();
	$ret_trailer .= "</li>\n";
}
$ret_trailer .= "</ul>\n";

echo "</ul>\n";
echo $ret_trailer;
echo "</div>\n";
?>