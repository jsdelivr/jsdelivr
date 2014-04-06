<?php
/**
 * Single book template for the Now Reading plugin.
 * This is NOT the template file for single posts. This file applies to the Now Reading plugin support within Suffusion.
 * If you want to edit the file a single post via the WP File Editor, see this: http://aquoid.com/forum/viewtopic.php?f=4&t=1499&p=6754#p6754
 *
 * @package Suffusion
 * @subpackage NowReading
 */

get_header();
global $nr_id, $suf_nr_single_added_show, $suf_nr_single_added_text, $suf_nr_single_started_show, $suf_nr_single_started_text, $suf_nr_single_finished_show, $suf_nr_single_finished_text, $suf_nr_single_meta_show;
?>

<div id="main-col">
<?php suffusion_before_begin_content(); ?>
	<div id="content">
<?php suffusion_after_begin_content(); ?>
        <article <?php post_class('post nr-post'); ?>>
<?php
if( have_books(intval($nr_id)) ) {
	while ( have_books(intval($nr_id)) ) {
		the_book();
?>
	<header class="post-header">
        <h1 class="posttitle"><?php book_title(); ?></h1>

		<div class="bookdata fix">
			<div class="author">
				<span class="icon">&nbsp;</span>
				<a href="<?php book_author_permalink() ?>"><?php book_author() ?></a>
			</div>

			<div class="rating">
				Rating: <?php echo book_rating(false); ?>
<!--				<img src="<?php echo get_template_directory_uri(); ?>/images/<?php book_rating() ?>.png" height="20px" title="Rating: <?php book_rating()?>" alt="Rating: <?php book_rating()?>" />-->
			</div>
<?php
		if( can_now_reading_admin() ) {
?>
			<div class="edit">
				<span class="icon">&nbsp;</span>
				<a href="<?php book_edit_url(); ?>">Edit this book</a>
			</div>

			<div class="manage">
				<span class="icon">&nbsp;</span>
				<a href="<?php manage_library_url(); ?>"><?php _e('Manage Books', 'suffusion');?></a>
			</div>
<?php
		}
?>
		</div>
	</header>
		<div class="bookentry fix">
			<div class="stats">
				<a href="<?php book_url(); ?>" title="<?php if (!is_custom_book()) { ?>Buy <?php echo esc_attr(book_title(false));?> from Amazon<?php }?>"><img src="<?php book_image(); ?>" alt="<?php echo esc_attr(book_title(false)); ?>" /></a>
				<br />
				<p>
<?php
		if ($suf_nr_single_added_show == 'show') {
				echo $suf_nr_single_added_text;
				echo book_added(false);
?>
				</p>
				<p>
<?php
		}
		if ($suf_nr_single_started_show == 'show') {
			echo $suf_nr_single_started_text;
			echo book_started(false);
?>
				</p>
				<p>
<?php
		}
		if ($suf_nr_single_finished_show == 'show') {
			echo $suf_nr_single_finished_text;
			echo book_finished(false);
?>
				</p>
				<p>
<?php
		}
		if ($suf_nr_single_meta_show == 'show') {
?>
					<?php print_book_meta(0); ?>
<?php
		}
?>
				</p>
			</div>

			<div class="review">
<?php
		book_review();
		if(book_has_post()) {
?>
				<p>This book is linked with the post <a href="<?php book_post_url() ?>">&ldquo;<?php book_post_title() ?>&rdquo;</a>.</p>
<?php
		}
?>
			</div><!--/.review -->

		<?php
			$tags = print_book_tags(false);
			if (trim($tags) != "") {
		?>
			<div class="post-footer postdata fix">
				<span class="tags"><?php _e('Tagged with: ', 'suffusion'); print_book_tags(1); ?></span>
			</div><!--/.post-footer -->
		<?php
			}
		?>
		</div><!-- bookentry -->
<?php
	}
}
else {
?>
		<header class="post-header">
			<h2 class='posttitle'><?php _e("Not Found", "suffusion"); ?></h2>
		</header>
		<div class='entry'>
			<p><?php _e("Sorry, but you are looking for something that isn't here", "suffusion"); ?></p>
		</div>
<?php
}
?>
	</article><!-- post -->

	</div><!-- content -->
</div><!-- main-col -->

<?php
get_footer();
?>
