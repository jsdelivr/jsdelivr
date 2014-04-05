<?php
/**
 * The site footer. This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Replacing this file in a child theme is the easiest and upgrade-safe way to "get rid of" the footer credits!
 * Users can override this in a child theme.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */

global $suf_footer_left, $suf_footer_center, $suf_footer_layout_style;
$display = apply_filters('suffusion_can_display_site_footer', true);
if (!$display) {
	return;
}
?>
<footer>
<?php
if ($suf_footer_layout_style != 'in-align') {
	?>
	<div id='page-footer'>
		<div class='col-control'>
	<?php

}
?>
	<div id="cred">
		<table>
			<tr>
				<td class="cred-left"><?php $strip = stripslashes($suf_footer_left); $strip = wp_specialchars_decode($strip, ENT_QUOTES); echo do_shortcode($strip); ?></td>
				<td class="cred-center"><?php $strip = stripslashes($suf_footer_center); $strip = wp_specialchars_decode($strip, ENT_QUOTES); echo do_shortcode($strip); ?></td>
				<td class="cred-right"><a href="http://aquoid.com/news/themes/suffusion/">Suffusion theme by Sayontan Sinha</a></td>
			</tr>
		</table>
	</div>
<?php
	if ($suf_footer_layout_style != 'in-align') {
	?>
		</div>
	</div>
	<?php

}
?>
</footer>
<!-- <?php echo get_num_queries(); ?> queries, <?php suffusion_get_memory_usage(); ?> in <?php timer_stop(1); ?> seconds. -->
