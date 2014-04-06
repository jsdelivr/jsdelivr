<?php
/**
 * This file creates a tile-style layout of posts, useful in a magazine blog.
 * This file is not to be loaded directly, but is instead loaded from different templates.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $query_string, $wp_query, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $suffusion_tile_layout, $suffusion_duplicate_posts;
global $suf_tile_excerpts_per_row, $suf_tile_image_settings, $suf_tile_images_enabled, $suf_mag_excerpt_full_story_text;
global $suffusion_cpt_post_id;
$suffusion_tile_layout = true;

if (!isset($suffusion_duplicate_posts)) $suffusion_duplicate_posts = array();

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

	$number_of_cols = count($wp_query->posts) - $suffusion_full_post_count_for_view;
	$total = count($wp_query->posts) - $suffusion_full_post_count_for_view;
//	$total = $wp_query->post_count;

	while (have_posts()) {
		the_post();
		if (in_array($post->ID, $suffusion_duplicate_posts)) {
			$total--;
		}
	}
	rewind_posts(); // reset the marker to the start

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

	$excerpts_per_row = (int)$suf_tile_excerpts_per_row;
	if (isset($suffusion_cpt_post_id)) {
		$cpt_posts_per_row = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_posts_per_row', true);
		if (!$cpt_posts_per_row && is_integer($cpt_posts_per_row)) {
			$excerpts_per_row = $cpt_posts_per_row;
		}
	}

	if ($number_of_cols > $excerpts_per_row) {
		$number_of_cols = $excerpts_per_row;
	}

	if ($number_of_cols > 0) {
?>
<div class='suf-tiles suf-tiles-<?php echo $number_of_cols;?>'>
<?php
		$ctr = 0;
		$cols_per_row = $number_of_cols;
		global $suffusion_byline_type, $suffusion_cpt_post_id;
		if (isset($suffusion_cpt_post_id)) {
			$suffusion_byline_type = 'cpt';
			$show_image = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_show_tile_thumb', true);
			add_filter('suffusion_add_taxonomy_bylines_tile', 'suffusion_cpt_tile_taxonomies', 10, 2);
		}
		else {
			$suffusion_byline_type = 'tile_layout';
		}

		while (have_posts()) {
			the_post();
			if (in_array($post->ID, $suffusion_duplicate_posts)) {
				continue;
			}
			$suffusion_current_post_index++;
			if ($ctr%$number_of_cols == 0) {
				if ($total - 1 - $ctr < $number_of_cols) {
					$cols_per_row = $total - $ctr;
				}
			}

			global $suf_mag_excerpt_full_story_position;
			do_action('suffusion_before_post', $post->ID, 'tile', $suffusion_current_post_index);
			echo "\n\t<article class='suf-tile suf-tile-{$cols_per_row}c $suf_mag_excerpt_full_story_position suf-tile-ctr-$ctr'>\n";
			$image_size = $suf_tile_image_settings == 'inherit' ? 'mag-excerpt' : 'tile-thumb';
			$image_link = suffusion_get_image(array($image_size => true));

			$show_image = isset($show_image) ? $show_image : (($suf_tile_images_enabled == 'show') || ($suf_tile_images_enabled == 'hide-empty' && $image_link != ''));
			$topmost = 'suf-tile-topmost';
			if ($show_image) {
				echo "\t\t<div class='suf-tile-image $topmost'>".$image_link."</div>\n";
				$topmost = '';
			}
			echo "\t\t<h2 class='suf-tile-title $topmost'><a class='entry-title' rel='bookmark' href='".get_permalink($post->ID)."'>".get_the_title($post->ID)."</a></h2>\n";

			get_template_part('custom/byline', 'tile');

			echo "\t\t<div class='suf-tile-text entry-content'>\n";
			suffusion_excerpt();
			echo "\t\t</div>\n";
			if (trim($suf_mag_excerpt_full_story_text)) {
				echo "\t<div class='suf-mag-excerpt-footer'>\n";
				echo "\t\t<a href='".get_permalink($post->ID)."' class='suf-mag-excerpt-full-story'>$suf_mag_excerpt_full_story_text</a>";
				echo "\t</div>\n";
			}

			echo "\t</article>";
			do_action('suffusion_after_post', $post->ID, 'tile', $suffusion_current_post_index);

			$ctr++;
		}
?>
</div>
<?php
	}
	suffusion_before_end_content();
}
else {
	get_template_part('layouts/template-missing');
}
?>