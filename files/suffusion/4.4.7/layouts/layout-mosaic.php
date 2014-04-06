<?php
/**
 * This file creates a mosaic-style layout of posts, useful in a photo blog.
 * This file is not to be loaded directly, but is instead loaded from different templates.
 *
 * @package Suffusion
 * @subpackage Layouts
 */

global $query_string, $wp_query, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $suffusion_mosaic_layout, $suffusion_duplicate_posts, $suffusion, $post;
global $suf_mosaic_constrain_row, $suf_mosaic_constrain_by_count, $suf_cat_info_enabled, $suf_author_info_enabled, $suf_tag_info_enabled;
global $suffusion_cpt_post_id;
$suffusion_mosaic_layout = true;

remove_action('suffusion_before_end_content', 'suffusion_pagination');
add_action('suffusion_before_end_content', 'suffusion_mosaic_pagination');

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

//query_posts($query_string);
$wp_query->rewind_posts();

$context = $suffusion->get_context();

if (have_posts()) {
	$suffusion_current_post_index = 0;
	$suffusion_full_post_count_for_view = suffusion_get_full_content_count();

	$custom_classes = array();
	if (isset($suffusion_cpt_post_id)) {
		add_action('suffusion_add_taxonomy_bylines_line', 'suffusion_cpt_line_taxonomies', 10, 2);
		add_action('suffusion_add_taxonomy_bylines_pullout', 'suffusion_cpt_line_taxonomies', 10, 4);
		$cpt_meta_position = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_byline_type', true);
		$custom_classes[] = $cpt_meta_position;
	}

	if ($suffusion_full_post_count_for_view > 0) {
		suffusion_after_begin_content();
	}

	$number_of_cols = count($wp_query->posts) - $suffusion_full_post_count_for_view;
	$total = count($wp_query->posts) - $suffusion_full_post_count_for_view;

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
	<article <?php post_class($custom_classes);?> id="post-<?php the_ID(); ?>">
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
		$col_class = '';
		if (isset($suffusion_cpt_post_id)) {
			$cpt_posts_per_row = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_posts_per_row', true);
			$col_class = 'suf-gallery-'.$cpt_posts_per_row.'c';
		}
		else if (isset($suf_mosaic_constrain_row) && isset($suf_mosaic_constrain_by_count) && $suf_mosaic_constrain_row == 'count') {
			$col_class = 'suf-gallery-'.$suf_mosaic_constrain_by_count.'c';
		}

		$ret = "";
		echo "<div class='suf-mosaic fix'>";
		echo "<div class='suf-mosaic-thumbs fix'>";
		while (have_posts()) {
			the_post();
			if (in_array($post->ID, $suffusion_duplicate_posts)) {
				continue;
			}

			$ret .= "\t<div class='suf-mosaic-thumb-container $col_class'>\n";
			$image_link = suffusion_get_image(array('mosaic-thumb' => true, 'show-title' => true, 'no-link' => true, 'get-original' => true));

			if (!$image_link) {
				$ret .= "<a href='".get_permalink()."'>".get_the_title()."</a>";
			}
			else {
				global $suffusion_original_image, $suf_mosaic_zoom, $suf_mosaic_show_title;
				if (isset($suffusion_original_image) && is_array($suffusion_original_image) && count($suffusion_original_image) > 0) {
					$overlay_html = "<div class='mosaic-overlay'>";
					if ($suf_mosaic_zoom == 'zoom') {
						$overlay_html .= "<a class='suf-mosaic-thumb' href='".$suffusion_original_image[0]."' title='".esc_attr(get_the_title())."' rel='mosaic-lightbox'><span>&nbsp;</span></a>";
					}
					if ($suf_mosaic_show_title == 'hide') {
						$overlay_html .= "<a class='suf-mosaic-post' href='".get_permalink()."' title='".esc_attr(get_the_title())."'><span>&nbsp;</span></a>";
					}
					if ($overlay_html == "<div class='mosaic-overlay'>") {
						$ret .= "<a class='suf-mosaic-post' href='".get_permalink()."' title='".esc_attr(get_the_title())."'>$image_link</a>";
						$ret .= "<a class='suf-mosaic-post-title' href='".get_permalink()."'>".get_the_title()."</a>";
					}
					else if ($suf_mosaic_show_title == 'show') {
						$overlay_html .= "</div>";
						$ret .= $image_link;
						$ret .= $overlay_html;
						$ret .= "<a class='suf-mosaic-post-title' href='".get_permalink()."'>".get_the_title()."</a>";
					}
					else {
						$overlay_html .= "</div>";
						$ret .= $image_link;
						$ret .= $overlay_html;
					}
				}
			}
			$ret .= "</div><!-- /.suf-mosaic-thumb-container -->";
		}
		echo $ret;
		echo "</div><!-- /.suf-mosaic-thumbs -->";
		suffusion_before_end_content();
		echo "</div><!-- /.suf-mosaic -->";
?>
		</div> <!-- /.entry -->
	</section> <!-- /.post -->
<?php
	}
}
else {
	get_template_part('layouts/template-missing');
}
?>