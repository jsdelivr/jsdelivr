<?php
/**
 * Search template for the Now Reading plugin.
 *
 * @package Suffusion
 * @subpackage NowReading
 */

get_header();
?>

<div id="main-col">
<?php suffusion_before_begin_content(); ?>
	<div id="content">
<?php suffusion_after_begin_content(); ?>
		<article <?php post_class('post nr-post'); ?>>
			<header class="post-header">
				<h1 class="posttitle">Search Results for <?php search_query(); ?></h1>
			</header>
			<div class="bookdata fix">
<?php
if( can_now_reading_admin() ) {
?>
				<div class="manage">
					<span class="icon">&nbsp;</span>
					<a href="<?php manage_library_url(); ?>"><?php _e('Manage Books', 'suffusion');?></a>
				</div>
<?php
}
?>
			</div>

			<div class="booklisting">
<?php
$nr_book_query = "status=all&num=-1&search={$GLOBALS['query']}";
get_template_part('now-reading/nr-shelf');
?>
			</div> <!-- /.booklisting -->
		</article><!-- /.nr-post -->
	</div><!-- /#content -->
</div>
<?php
get_footer();
?>
