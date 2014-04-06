<?php
/**
 * Template Name: All Categories
 *
 * Displays all the categories used within the blog.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suf_temp_cats_hierarchical, $suf_temp_cats_post_count, $suf_temp_cats_rss;
get_header();
?>
    <div id="main-col">
<?php suffusion_before_begin_content(); ?>
	  <div id="content">
<?php
global $post;
if (have_posts()) {
	while (have_posts()) {
		the_post();
		$original_post = $post;
		do_action('suffusion_before_post', $post->ID, 'blog', 1);
?>
    <article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
<?php suffusion_after_begin_post(); ?>

	    <div class="entry-container fix">
		    <div class="entry fix">
				<?php suffusion_content(); ?>
			</div><!--/entry -->

			<ul class="category-archives">
<?php
		$show_hierarchical = $suf_temp_cats_hierarchical == "hierarchical" ? true : false;
		$show_post_count = $suf_temp_cats_post_count == "show" ? true : false;
		if ($suf_temp_cats_rss == "show") {
			wp_list_categories(array('feed' => __('RSS', 'suffusion'), 'show_count' => $show_post_count, 'hierarchical' => $show_hierarchical,
				'use_desc_for_title' => false, 'title_li' => false ));
		}
		else {
			wp_list_categories(array('show_count' => $show_post_count, 'hierarchical' => $show_hierarchical, 'use_desc_for_title' => false, 'title_li' => false ));
		}
?>
			</ul><!-- /.category-archives -->
		</div><!-- .entry-container -->
<?php
		// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
		$post = $original_post;
		suffusion_before_end_post();
		comments_template();
?>
	</article><!-- post -->
<?php
		do_action('suffusion_after_post', $post->ID, 'blog', 1);
	}
}
?>
      </div><!-- content -->
	</div><!-- main col -->
<?php get_footer(); ?>
