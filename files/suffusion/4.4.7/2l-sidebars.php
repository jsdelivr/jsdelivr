<?php
/**
 * Template Name: 2 Left Sidebars (Deprecated)
 *
 * @package Suffusion
 * @subpackage Templates
 */

get_header();
?>

<div id="main-col">
<?php
suffusion_page_navigation();
suffusion_before_begin_content();
?>
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
			<?php
				// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
				$post = $original_post;
				suffusion_after_content();
			?>
			</div><!-- .entry-container -->
			<?php suffusion_before_end_post(); ?>

			<?php comments_template(); ?>
		</article><!--/post -->
<?php
		do_action('suffusion_after_post', $post->ID, 'blog', 1);
	}
}
?>
	</div>
</div>
<?php get_footer(); ?>
