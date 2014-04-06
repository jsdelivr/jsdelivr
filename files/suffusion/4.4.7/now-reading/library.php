<?php
/**
 * Library template for the Now Reading plugin.
 *
 * @package Suffusion
 * @subpackage NowReading
 */

get_header();
global $nr_book_query, $suf_nr_lib_order, $suf_nr_lib_title, $suf_nr_lib_curr_show, $suf_nr_lib_curr_title, $suf_nr_lib_curr_text, $suf_nr_lib_unread_show, $suf_nr_lib_unread_title;
global $suf_nr_lib_unread_text, $suf_nr_lib_completed_show, $suf_nr_lib_completed_title, $suf_nr_lib_completed_text;

$lib_order = suffusion_get_entity_order($suf_nr_lib_order, 'nr');
$lib_order = explode(',', $lib_order);
?>

<div id="main-col">
<?php suffusion_before_begin_content(); ?>
	<div id="content">
<?php suffusion_after_begin_content(); ?>
		<article <?php post_class('post nr-post'); ?>>
			<header class="post-header">
				<h1 class="posttitle"><?php echo stripslashes($suf_nr_lib_title); ?></h1>
			</header>
			<div class="bookdata fix">
<?php
		if( can_now_reading_admin()) {
?>
				<div class="manage">
					<span class="icon">&nbsp;</span>
					<a href="<?php manage_library_url(); ?>"><?php _e('Manage Books', 'suffusion');?></a>
				</div>
<?php
		}
?>
			</div>
			<div class="entry">
<?php
		foreach ($lib_order as $entity) {
			if ($entity == 'current' && $suf_nr_lib_curr_show == 'show') {
?>
				<h3><?php echo stripslashes($suf_nr_lib_curr_title);?></h3>
<?php
				echo stripslashes($suf_nr_lib_curr_text);
?>
				<div class="booklisting">
				<?php
				$nr_book_query = "status=reading&num=-1";
				get_template_part('now-reading/nr-shelf');
				?>
				</div>
<?php
			}
			else if ($entity == 'unread' && $suf_nr_lib_unread_show == 'show') {
?>
				<h3><?php echo stripslashes($suf_nr_lib_unread_title); ?></h3>
<?php
				echo stripslashes($suf_nr_lib_unread_text);
?>
				<div class="booklisting">
				<?php
				$nr_book_query = "status=unread&num=-1";
				get_template_part('now-reading/nr-shelf');
				?>
				</div>
<?php
			}
			else if ($entity == 'completed' && $suf_nr_lib_completed_show == 'show') {
?>
				<h3><?php echo stripslashes($suf_nr_lib_completed_title); ?></h3>
<?php
				echo stripslashes($suf_nr_lib_completed_text);
?>
				<div class="booklisting">
				<?php
				$nr_book_query = "status=read&num=-1";
				get_template_part('now-reading/nr-shelf');
				?>
				</div>
<?php
			}
		}
?>
			</div>
		</article>
	</div><!-- /#content -->
</div><!-- /#main-col -->
<?php
get_footer();
?>
