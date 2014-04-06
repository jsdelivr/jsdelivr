<?php
/**
 * Template Name: Blog Authors
 * 
 * Displays all the authors of this blog.
 * A brief bio is shown for each author. 
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
				<?php suffusion_content(); ?>
			</div><!--/entry -->
<?php
		$authors = get_users(); // WP 3.1 function.
		$i = 0;
		foreach ($authors as $author) {
			$author_id = $author->ID;
			if ($i%2 == 0) {
				$odd_or_even = 'even';
			}
			else {
				$odd_or_even = 'odd';
			}
?>
		<section id="author-profile-<?php the_author_meta('user_nicename', $author_id); ?>" class="author-profile author-<?php echo $odd_or_even; ?> fix">
			<h2 class="author-title fn n"><?php the_author_meta('display_name', $author_id); ?></h2>
			<div class="author-description">
				<?php echo get_avatar(get_the_author_meta('user_email', $author_id), '96'); ?>
				<p class="author-bio">
					<?php the_author_meta('description', $author_id); ?>
				</p><!-- /.author-bio -->
			</div><!-- /.author-description -->
		</section><!-- /.author-profile -->

<?php
			$i++;
		}
		// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
		$post = $original_post;
?>
		</div><!-- .entry-container -->
<?php
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
