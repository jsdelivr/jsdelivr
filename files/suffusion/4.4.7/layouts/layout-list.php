<?php
/**
 * This file creates a list-style layout of posts, useful if you are putting together a literary-style site.
 * This file is not to be loaded directly, but is instead loaded from different templates.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suffusion, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $page_of_posts, $suffusion_list_layout, $suffusion_duplicate_posts, $suffusion_cpt_post_id;
global $post, $page_title, $wp_query, $suf_excerpt_list_count, $suf_cat_info_enabled, $suf_author_info_enabled, $suf_tag_info_enabled, $suf_excerpt_list_style;

$context = $suffusion->get_context();
$suffusion_list_layout = true;
if (!isset($suffusion_duplicate_posts)) $suffusion_duplicate_posts = array();

$page_title = get_bloginfo('name');
if (have_posts()) {
	the_post();
	$original_post = $post;
	$temp_title = wp_title('', false);
	if (trim($temp_title) != '') {
		$page_title = $temp_title;
	}
}

$hide_title = false;
if (isset($suffusion_cpt_post_id)) {
	$page_title = get_the_title($suffusion_cpt_post_id);
	$hide_title = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_hide_page_title', true);
}

if ($suf_excerpt_list_count == 'all' && !$page_of_posts) {
	$query_args = $wp_query->query;
	$query_args['posts_per_page'] = -1;
	$wp_query = new WP_Query($query_args);
}
else if ($page_of_posts) {
	query_posts('posts_per_page=-1');
}
else { // Not resetting the query_posts results skips the first entry
	$wp_query->rewind_posts();
}

if (have_posts()) {
	$suffusion_current_post_index = 0;
	$suffusion_full_post_count_for_view = suffusion_get_full_content_count();
	$total = $wp_query->post_count - $suffusion_full_post_count_for_view;

	if ($suffusion_full_post_count_for_view > 0) {
		suffusion_after_begin_content();
	}

	while (have_posts()) {
		$suffusion_current_post_index++;
		if ($suffusion_current_post_index > $suffusion_full_post_count_for_view) {
			break;
		}
		the_post();
		if (in_array($post->ID, $suffusion_duplicate_posts)) {
			$suffusion_current_post_index--;
			continue;
		}
?>
	<article class="post fix <?php if (is_sticky()) { echo " sticky-post "; } ?>" id="post-<?php the_ID(); ?>">
<?php
		suffusion_after_begin_post();
?>
		<div class="entry-container fix">
			<div class="entry fix">
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
	}

	$class = "";
	$information = "";
	if (in_array('category', $context)) {
		$information = $suf_cat_info_enabled == 'enabled' ? suffusion_get_category_information() : false;
		$class = 'info-category';
	}
	else if (in_array('author', $context)) {
		$information = $suf_author_info_enabled == 'enabled' ? suffusion_get_author_information() : false;
		$class = 'author-profile';
	}
	else if (in_array('tag', $context)) {
		$tag_id = get_query_var('tag_id');
		$information = $suf_tag_info_enabled == 'enabled' ? tag_description($tag_id) : false;
		$class = 'info-tag';
	}

	if ($suffusion_full_post_count_for_view == 0) {
?>
	<section class='post <?php echo $class; ?> fix'>
<?php
		if (!$hide_title) {
?>
		<header class="post-header">
			<h2 class="posttitle"><?php echo $page_title; ?></h2>
		</header>
<?php
		}
?>
		<div class="entry fix">
<?php
		echo $information;
	}
	else if ($total > 0) {
?>
	<section class='post <?php echo $class; ?> fix'>
		<div class="entry fix">
<?php
	}

	if ($total > 0) {
		echo "<$suf_excerpt_list_style>\n";
		while (have_posts()) {
			the_post();
			if (in_array($post->ID, $suffusion_duplicate_posts)) {
				continue;
			}
			echo "<li>";
			echo suffusion_get_post_title_and_link();
			echo "</li>\n";
		}
		echo "</$suf_excerpt_list_style>\n";
?>
		</div> <!-- /.entry -->
	</section> <!-- /.post -->
<?php
	}

	if ($suf_excerpt_list_count != 'all') {
		suffusion_before_end_content();
	}
}
else {
	get_template_part('layouts/template-missing');
}
?>