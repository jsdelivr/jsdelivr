<?php

global $nr_book_query,$suf_nr_books_per_row, $suf_nr_no_books_text;

$books_per_row = (int)$suf_nr_books_per_row;
$col_ctr = 0;
//$nr_book_count = total_books($nr_book_status, false);
if(have_books($nr_book_query)) {
?>
<table class='nr-shelf'>
<?php
	for ($i = 0; $i < $books_per_row - 1; $i++) {
?>
		<col class='nr-shelf-slot'/>
<?php
	}
?>
		<col/>
<?php
	$tr_closed = false;
	while( have_books($nr_book_query) ) {
		the_book();
		$col_ctr++;
		if ($col_ctr%$books_per_row == 1) {
			$tr_closed = false;
?>
	<tr>
<?php
		}
?>
		<td>
			<a href="<?php echo book_permalink(false); ?>" title="<?php echo esc_attr(book_title(false)); ?> by <?php echo esc_attr(book_author(false)); ?>"><img src="<?php echo book_image(false); ?>" alt="<?php echo book_title(false); ?> by <?php echo book_author(false); ?>" /></a>
		</td>
<?php
		if ($col_ctr%$books_per_row == 0) {// || $col_ctr == $nr_book_count) {
			$tr_closed = true;
?>
	</tr>
<?php
		}
	}
	if (!$tr_closed) {
		echo "</tr>\n";
	}
?>
</table>
<?php
}
else {
?>
<p>
<?php
	$strip = stripslashes($suf_nr_no_books_text);
	$strip = wp_specialchars_decode($strip, ENT_QUOTES);
	do_shortcode($strip);
	echo $strip;
?>
</p>
<?php
}
?>