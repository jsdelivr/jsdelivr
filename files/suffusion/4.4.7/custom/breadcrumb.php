<?php
/**
 * Shows the breadcrumb for anything on a site (other than pages) based on the following algorithm:
 *	- For single posts it tries to show the first multi-level taxonomy associated (almost always this will be a category)
 *	- For single custom posts it tries to do the same as above if the post type is not hierarchical
 * 	- For single custom posts that are of non-hierarchical post types, it prints the taxonomy to the root
 * 	- For categories and any other taxonomies it prints the parent hierarchy
 * 	- For authors, tags, search results and 404 it prints the single name of the view.
 * 	- For dates it prints the hierarchy up to the year
 * A home link/icon is optionally shown.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */

global $post, $wp_query, $suf_breadcrumb_separator, $suf_show_breadcrumbs_in, $suf_show_home_in;
if (trim($suf_show_breadcrumbs_in) == '') {
	return;
}
$show = explode(',', $suf_show_breadcrumbs_in);
$show_home = explode(',', $suf_show_home_in);

$stack = array();

// Special handling for attachments. The name of the attachment is shown, then the full path to the including post is shown.
if (is_attachment() && in_array('attach', $show)) {
	$stack[] = get_the_title();
	$ancestors = get_ancestors($post->ID, get_post_type());

	foreach ($ancestors as $ancestor) {
		$ancestor = get_post($ancestor);
		$stack[] = array(get_the_title($ancestor->ID), get_permalink($ancestor));
		$post = $ancestor;
	}
}

if (is_front_page() || is_home()) {
	// Do nothing. No breadcrumb for the front page or the blog posts.
}
else if ((is_single() && get_post_type() == 'post' && in_array('single', $show)) ||
		 (is_single() && !is_page() && get_post_type() != 'post' && in_array('custom-posts', $show) && !(is_post_type_hierarchical(get_post_type()) && in_array('custom-post-hierarchy', $show)))) {
	if (!is_attachment()) {
		$stack[] = get_the_title();
	}
	$taxonomies = get_taxonomies();
	$terms = null;
	foreach ($taxonomies as $taxonomy) {
		$terms = get_the_terms($post->ID, $taxonomy);
		if ($terms != null && count($terms) != 0) {
			break;
		}
	}

	if (is_array($terms)) {
		$root = array();
		$non_root = array();

		foreach ($terms as $term) {
			if (is_object($term)) {
				if ($term->parent == 0) {
					$root[] = $term;
				}
				else {
					$non_root[] = $term;
				}
			}
		}
		if (count($non_root) == 0) {
			$term = $root[0];
			$stack[] = array($term->name, get_term_link($term));
		}
		else if (count($non_root) != 0) {
			$term = $non_root[0];
			$stack[] = array($term->name, get_term_link($term));
			$ancestors = get_ancestors($term->term_id, $term->taxonomy);
			foreach ($ancestors as $ancestor) {
				$ancestor = get_term($ancestor, $term->taxonomy);
				$stack[] = array($ancestor->name, get_term_link($ancestor));
			}
		}
	}

	if ((get_post_type() == 'post' && in_array('single', $show) && in_array('single', $show_home)) ||
		(get_post_type() != 'post' && in_array('custom-posts', $show) && in_array('custom-posts', $show_home))) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if (is_single() && is_post_type_hierarchical(get_post_type()) && !is_page() && get_post_type() != 'post' && in_array('custom-post-hierarchy', $show)) {
	$stack[] = get_the_title();
	$ancestors = get_ancestors($post->ID, get_post_type());

	foreach ($ancestors as $ancestor) {
		$ancestor = get_post($ancestor);
		$stack[] = array(get_the_title($ancestor->ID), get_permalink($ancestor));
	}

	if (in_array('custom-post-hierarchy', $show_home)) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if ((is_category()  && in_array('category', $show)) || (is_tag() && in_array('tag', $show)) ||
		 (is_tax() && !is_category() && !is_tag() && in_array('taxonomy', $show)) ||
		 (is_post_type_archive() && !is_post_type_archive('post') && in_array('custom-post-archives', $show))) {
	$term = $wp_query->get_queried_object();
	$stack[] = $term->name;
	$ancestors = get_ancestors($term->term_id, $term->taxonomy);
	foreach ($ancestors as $ancestor) {
		$ancestor = get_term($ancestor, $term->taxonomy);
		$stack[] = array($ancestor->name, get_term_link($ancestor));
	}

	if ((is_category()  && in_array('category', $show) && in_array('category', $show_home)) ||
		(is_tag() && in_array('tag', $show) && in_array('tag', $show_home)) ||
		(is_tax() && !is_category() && !is_tag() && in_array('taxonomy', $show) && in_array('taxonomy', $show_home)) ||
		(is_post_type_archive() && !is_post_type_archive('post') && in_array('custom-post-archives', $show) && in_array('custom-post-archives', $show_home))) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if (is_date() && in_array('date', $show)) {
	if (is_day()) {	// Show Date, Month, Year
		$stack[] = get_the_time(__('j', 'suffusion'));
		$stack[] = array(get_the_time(__('F', 'suffusion')), get_month_link(get_the_time('Y'), get_the_time('m')));
		$stack[] = array(get_the_time(__('Y', 'suffusion')), get_year_link(get_the_time('Y')));
	}
	elseif (is_month()) {	// Show Month and Year
		$stack[] = get_the_time(__('F', 'suffusion'));
		$stack[] = array(get_the_time(__('Y', 'suffusion')), get_year_link(get_the_time('Y')));
	}
	elseif (is_year()) {	// Show Year
		$stack[] = get_the_time(__('Y', 'suffusion'));
	}

	if (in_array('date', $show_home)) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if (is_author() && in_array('author', $show)) {
	$stack[] = get_the_author_meta('display_name', get_query_var('author'));

	if (in_array('author', $show_home)) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if (is_search() && in_array('search', $show)) {
	$title = wp_title(':', false);
	$title = trim($title);
	if (substr($title, 0, 1) == ':') {
		$title = substr($title, 1);
	}
	$stack[] = $title;

	if (in_array('search', $show_home)) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}
else if (is_404() && in_array('404', $show)) {
	global $suf_404_title, $suffusion_404_title;
	if (trim($suf_404_title) == '') {
		$stack[] = $suffusion_404_title;
	}
	else {
		$title = stripslashes($suf_404_title);
		$stack[] = do_shortcode($title);
	}

	if (in_array('404', $show_home)) {
		$stack[] = array(__('Home', 'suffusion'), home_url());
	}
}

$stack = array_reverse($stack);
$string_stack = array();
foreach ($stack as $element) {
	if (is_array($element) && count($element) > 1 && is_string($element[0]) && is_string($element[1])) {
		$string_stack[] = "<a href='{$element[1]}' title='".esc_attr($element[0])."'>{$element[0]}</a>";
	}
	else if (is_array($element) && count($element) == 1 && is_string($element[0])) {
		$string_stack[] = $element[0];
	}
	else if (!is_array($element)) {
		$string_stack[] = $element;
	}
}
$out = implode(' '.$suf_breadcrumb_separator.' ', $string_stack);
if ($out != '') {
	$out = "<div id='subnav' class='fix'><div class='breadcrumb'>$out</div></div>";
}
echo apply_filters('suffusion_breadcrumb_text', $out);
?>