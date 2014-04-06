<?php
/**
 * Tag template for the Now Reading plugin.
 *
 * @package Suffusion
 * @subpackage NowReading
 */

global $nr_book_query;
get_header();
?>

<div id="main-col">
<?php suffusion_before_begin_content(); ?>
	<div id="content">
<?php suffusion_after_begin_content(); ?>
		<article <?php post_class('post nr-post'); ?>>
			<header class="post-header">
				<h1 class="posttitle">Books tagged with <?php the_tag(); ?></h1>

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
			</header>
			<div class="booklisting">
<?php
$nr_book_query = "tag={$GLOBALS['nr_tag']}&num=-1";
get_template_part('now-reading/nr-shelf');
?>
			</div><!-- /.booklisting -->
		</article><!-- /.nr-post -->
	</div><!-- /#content -->
</div><!-- /#main-col -->

<?php
get_footer();
?>
