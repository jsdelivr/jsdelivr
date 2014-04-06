<?php
/**
 * This file creates a blog-style layout of posts, useful if you are creating a generic blog.
 * This file is not to be loaded directly, but is instead loaded from different templates.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suffusion, $query_string, $wp_query, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $suffusion_blog_layout, $suffusion_duplicate_posts;
$suffusion_blog_layout = true;
if (!isset($suffusion_duplicate_posts)) $suffusion_duplicate_posts = array();

global $post, $suffusion_cpt_post_id;
if (have_posts()) {
	$suffusion_current_post_index = 0;
	$suffusion_full_post_count_for_view = suffusion_get_full_content_count();
	if (isset($suffusion_cpt_post_id)) {
		add_action('suffusion_add_taxonomy_bylines_line', 'suffusion_cpt_line_taxonomies', 10, 2);
		add_action('suffusion_add_taxonomy_bylines_pullout', 'suffusion_cpt_line_taxonomies', 10, 4);
		$cpt_meta_position = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_byline_type', true);
	}
	while (have_posts()) {
		the_post();
		$original_post = $post;
		if (in_array($post->ID, $suffusion_duplicate_posts)) {
			continue;
		}
		$suffusion_current_post_index++;

		global $suf_category_excerpt, $suf_tag_excerpt, $suf_archive_excerpt, $suf_index_excerpt, $suf_search_excerpt, $suf_author_excerpt, $suf_show_excerpt_thumbnail, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $suf_pop_excerpt, $page_of_posts;

		if (($suffusion_current_post_index > $suffusion_full_post_count_for_view) && ((is_category() && $suf_category_excerpt == "excerpt") ||
			(is_tag() && $suf_tag_excerpt == "excerpt") ||
			(is_search() && $suf_search_excerpt == "excerpt") ||
			(is_author() && $suf_author_excerpt == "excerpt") ||
			((is_date() || is_year() || is_month() || is_day() || is_time())&& $suf_archive_excerpt == "excerpt") ||
			(isset($page_of_posts) && $page_of_posts && $suf_pop_excerpt == "excerpt") ||
			(!(is_singular() || is_category() || is_tag() || is_search() || is_author() || is_date() || is_year() || is_month() || is_day() || is_time()) && $suf_index_excerpt == "excerpt"))) {
			$show_image = $suf_show_excerpt_thumbnail == "show" ? true : false;
			$classes = array('excerpt');
		}
		else {
			$classes = array('full-content');
		}
		if (isset($cpt_meta_position) && $cpt_meta_position) {
			$classes[] = 'meta-position-'.$cpt_meta_position;
		}

		do_action('suffusion_before_post', $post->ID, 'blog', $suffusion_current_post_index);
?>
	<article <?php post_class($classes);?> id="post-<?php the_ID(); ?>">
<?php
		suffusion_after_begin_post();
?>
	<div class="entry-container fix">
		<div class="entry entry-content fix">
<?php
		suffusion_content();
?>
		</div><!--entry -->
<?php
		// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
		$post = $original_post;
		suffusion_after_content();
?>
	</div><!-- .entry-container -->
<?php
		suffusion_before_end_post();
?>
	</article><!--post -->
<?php
		do_action('suffusion_after_post', $post->ID, 'blog', $suffusion_current_post_index);
	}
	suffusion_before_end_content();
}
else {
	get_template_part('layouts/template-missing');
}
?>