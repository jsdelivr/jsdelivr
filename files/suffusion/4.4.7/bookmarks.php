<?php
/**
 * Template Name: All Bookmarks
 * 
 * Displays all the bookmarks (external links) in the blog
 *
 * @package Suffusion
 * @subpackage Templates
 */

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
<?php
        suffusion_content();
        $args = array(
            'title_li' => false,
            'title_before' => '<h4>',
            'title_after' => '</h4>',
            'category_before' => false,
            'category_after' => false,
            'categorize' => true,
            'show_description' => true,
            'between' => '<br />',
            'show_images' => false,
            'show_rating' => false,
        );

        wp_list_bookmarks($args);
?>
			</div><!--/entry -->
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
