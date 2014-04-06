<?php
/**
 * Displays the Widget Area Below Header. This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

global $suf_widget_area_below_header_enabled, $suf_ns_wabh_enabled, $suf_wa_wabh_style;
$display = apply_filters('suffusion_can_display_widget_area_below_header', true);
if (!$display) {
	return;
}
if ($suf_widget_area_below_header_enabled == "enabled") {
	$suffusion_pseudo_template = suffusion_get_pseudo_template_class();
	if ((is_page_template('no-sidebars.php') && $suf_ns_wabh_enabled == 'not-enabled') || (in_array('page-template-no-sidebars-php', $suffusion_pseudo_template) && $suf_ns_wabh_enabled == 'not-enabled')) {
	}
	else if (!suffusion_is_sidebar_empty(4)) { ?>
<!-- horizontal-outer-widgets-1 Widget Area -->
<div id="horizontal-outer-widgets-1" class="dbx-group <?php echo $suf_wa_wabh_style;?> warea fix">
	<?php
		dynamic_sidebar('Widget Area Below Header');
	?>
</div>
<!-- /horizontal-outer-widgets-1 --><?php
	}
}
?>