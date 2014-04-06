<?php
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
?>
	<article <?php post_class();?> id="post-<?php the_ID(); ?>">
<?php suffusion_after_begin_post(); ?>
		<div class="entry-container fix">
			<div class="entry fix">
<?php
	suffusion_attachment();
	suffusion_content();
?>
	<p class="navigation-attachment">
		<span class="alignleft"><?php previous_image_link('thumbnail', __('Previous Image', 'suffusion')); ?></span>
		<span class="alignright"><?php next_image_link('thumbnail', __('Next Image', 'suffusion')); ?></span>
	</p><!-- .navigation-attachment -->
			</div><!--/entry -->
<?php
		// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
		$post = $original_post;
		suffusion_after_content();
?>
		</div><!-- .entry-container -->
<?php
		suffusion_before_end_post();

		global $suf_image_comments;
		if (isset($suf_image_comments) && $suf_image_comments == 'on') {
			// No comments
		}
		else {
			comments_template();
		}
?>
	</article><!--/post -->
<?php
	}
}
else {
?>
        <article class="post fix">
		<p><?php _e('Sorry, no posts matched your criteria.', 'suffusion'); ?></p>
        </article><!--post -->

<?php
}
?>
      </div><!-- content -->
    </div><!-- main col -->
<?php
get_footer();
?>