<?php
/**
 * This is the template file for single posts. It is used by single posts of any post type.
 *
 */
get_header();
?>
    <div id="main-col">
		<?php suffusion_before_begin_content(); ?>
  	<div id="content">
<?php
global $post, $suffusion_is_cpt;
if ($post->post_type != 'post') {
	$suffusion_is_cpt = true;
	add_filter('suffusion_byline_position', 'suffusion_single_cpt_byline_position');
	add_action('suffusion_add_taxonomy_bylines_line', 'suffusion_cpt_line_taxonomies', 10, 2);
	add_action('suffusion_add_taxonomy_bylines_pullout', 'suffusion_cpt_line_taxonomies', 10, 4);
	global $suffusion_cpt_layouts, $suf_cpt_bylines_posted_by, $suf_cpt_bylines_comments, $suf_cpt_bylines_permalinks, $suf_cpt_bylines_post_date;
	if (isset($suffusion_cpt_layouts[$post->post_type]) && isset($suffusion_cpt_layouts[$post->post_type]['byline-contents'])) {
		$byline_contents = explode(',', $suffusion_cpt_layouts[$post->post_type]['byline-contents']);
		$suf_cpt_bylines_posted_by = in_array('posted-by', $byline_contents) ? 'show' : 'hide';
		$suf_cpt_bylines_comments = in_array('comments', $byline_contents) ? 'show' : 'hide';
		$suf_cpt_bylines_permalinks = in_array('permalink', $byline_contents) ? 'show' : 'hide';
		$suf_cpt_bylines_post_date = in_array('date', $byline_contents) ? 'show' : 'hide';
	}
	else {
		$suf_cpt_bylines_posted_by = false;
		$suf_cpt_bylines_comments = false;
		$suf_cpt_bylines_permalinks = false;
		$suf_cpt_bylines_post_date = false;
	}
}

if (have_posts()) {
	while (have_posts()) {
		the_post();
		global $suf_prev_next_above_below;
		if ($suf_prev_next_above_below == 'above' || $suf_prev_next_above_below == 'above-below') {
			get_template_part('custom/prev-next');
		}
		$original_post = $post;
		do_action('suffusion_before_post', $post->ID, 'blog', 1);
?>
	<article <?php post_class();?> id="post-<?php the_ID(); ?>">
<?php
		suffusion_after_begin_post();
	?>
		<div class="entry-container fix">
			<div class="entry fix">
<?php
		suffusion_content();
?>
			</div><!--/entry -->
<?php
		// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
		$post = $original_post;
		suffusion_after_content();
?>
		</div><!-- .entry-container -->
<?php
		suffusion_before_end_post();
		comments_template();
?>
	</article><!--/post -->
<?php
		do_action('suffusion_after_post', $post->ID, 'blog', 1);
		if ($suf_prev_next_above_below == 'below' || $suf_prev_next_above_below == 'above-below') {
			get_template_part('custom/prev-next');
		}
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