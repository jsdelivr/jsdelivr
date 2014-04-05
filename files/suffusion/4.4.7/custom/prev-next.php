<?php
/**
 * Shows the Previous and Next post links for a post. This can be displayed at the top or bottom of your posts or at both locations.
 * The previous / next posts can be restricted to the same category as the current post or the category restriction can be ignored.
 *
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */
global $suf_prev_next_categories;

if (suffusion_post_count() > 1) {
	if ($suf_prev_next_categories == 'restrict' && get_post_type() == 'post') {
		$in_same_cat = true;
	}
	else {
		$in_same_cat = false;
	}
?>
<nav class='post-nav fix'>
<table>
<tr>
	<td class='previous'><?php previous_post_link('%link', '<span class="icon">&nbsp;</span> %title', $in_same_cat) ?></td>
	<td class='next'><?php next_post_link('%link', '<span class="icon">&nbsp;</span> %title', $in_same_cat) ?></td>
</tr>
</table>
</nav>
<?php
}

?>