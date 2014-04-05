<?php
/**
 * Widget template for the Now Reading plugin.
 *
 * @package Suffusion
 * @subpackage NowReading
 */

global $nr_book_query, $suf_nr_wid_order, $suf_nr_wid_search_show, $suf_nr_wid_curr_show, $suf_nr_wid_curr_title, $suf_nr_no_books_text, $suf_nr_wid_unread_show, $suf_nr_wid_unread_title, $suf_nr_wid_completed_show, $suf_nr_wid_completed_title;

$lib_order = suffusion_get_entity_order($suf_nr_wid_order, 'nr');
$lib_order = explode(',', $lib_order);

?>
<div class="now-reading">
<?php
if ($suf_nr_wid_search_show == 'top') {
	library_search_form();
}
foreach ($lib_order as $entity) {
	if ($entity == 'current' && $suf_nr_wid_curr_show == 'show') {
?>
	<h4><?php echo stripslashes($suf_nr_wid_curr_title);?></h4>
<?php
		if( have_books('status=reading') ) {
			while(have_books('status=reading')) {
				the_book();
?>
	<a href="<?php book_permalink() ?>"><img src="<?php book_image() ?>" alt="<?php echo esc_attr(book_title(false)); ?>" title="<?php echo esc_attr(book_title(false)); ?> by <?php echo esc_attr(book_author(false)); ?>"/></a>
<?php
			}
		}
		else {
?>
				<p>
			<?php
				$strip = stripslashes($suf_nr_no_books_text);
				$strip = wp_specialchars_decode($strip, ENT_QUOTES);
				echo $strip;
			?>
				</p>
<?php
		}
	}
	else if ($entity == 'unread' && $suf_nr_wid_unread_show == 'show') {
?>
	<h4><?php echo stripslashes($suf_nr_wid_unread_title);?></h4>
<?php
		if( have_books('status=unread') ) {
			while(have_books('status=unread')) {
				the_book();
?>
	<a href="<?php book_permalink() ?>"><img src="<?php book_image() ?>" alt="<?php echo esc_attr(book_title(false)); ?>" title="<?php echo esc_attr(book_title(false)); ?> by <?php echo esc_attr(book_author(false)); ?>"/></a>
<?php
			}
		}
		else {
?>
				<p>
				<?php
					$strip = stripslashes($suf_nr_no_books_text);
					$strip = wp_specialchars_decode($strip, ENT_QUOTES);
					echo $strip;
				?>
				</p>
<?php
		}
	}
	else if ($entity == 'completed' && $suf_nr_wid_completed_show == 'show') {
?>
	<h4><?php echo stripslashes($suf_nr_wid_completed_title);?></h4>
<?php
		if(have_books('status=read&orderby=finished&order=desc')) {
			while(have_books('status=read&orderby=finished&order=desc')) {
				the_book();
?>
	<a href="<?php book_permalink() ?>"><img src="<?php book_image() ?>" alt="<?php echo esc_attr(book_title(false)); ?>" title="<?php echo esc_attr(book_title(false)); ?> by <?php echo esc_attr(book_author(false)); ?>"/></a>
<?php
			}
		}
		else {
?>
				<p>
				<?php
					$strip = stripslashes($suf_nr_no_books_text);
					$strip = wp_specialchars_decode($strip, ENT_QUOTES);
					echo $strip;
				?>
				</p>
<?php
		}
	}
}
if ($suf_nr_wid_search_show == 'bottom') {
	library_search_form();
}
?>
	<p><a href="<?php library_url() ?>">View full Library</a></p>

</div>
