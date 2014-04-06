<?php
/**
 * Displays the Widget Area Above Footer. This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */
global $suf_widget_area_above_footer_enabled, $suf_ns_waaf_enabled, $suf_wa_waaf_style;
$display = apply_filters('suffusion_can_display_widget_area_above_footer', true);
if (!$display) {
	return;
}
if ($suf_widget_area_above_footer_enabled == "enabled") {
	$suffusion_pseudo_template = suffusion_get_pseudo_template_class();
	if ((is_page_template('no-sidebars.php') && $suf_ns_waaf_enabled == 'not-enabled') || (in_array('page-template-no-sidebars-php', $suffusion_pseudo_template) && $suf_ns_waaf_enabled == 'not-enabled')) {
	}
	else if (!suffusion_is_sidebar_empty(5)) {
		?>
	<!-- horizontal-outer-widgets-2 Widget Area -->
	<div id="horizontal-outer-widgets-2" class="<?php echo $suf_wa_waaf_style; ?> warea fix">
		<?php
			dynamic_sidebar('Widget Area Above Footer');
		?>
	</div>
	<!-- /horizontal-outer-widgets-2 -->
		<?php

	}
}
?>