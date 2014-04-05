<?php
/**
 * Dynamically generated styles
 *
 * @package Suffusion
 * @subpackage Templates
 */

header("Content-type: text/css; charset=UTF-8");
header("Cache-Control: must-revalidate");

global $suffusion_unified_options, $suffusion_theme_name, $content_width;
global $suf_size_options, $suf_sidebar_count, $suf_autogen_css;

$suffusion_unified_options = suffusion_get_unified_options();

if ($suffusion_unified_options['suf_autogen_css'] == 'autogen' || $suffusion_unified_options['suf_autogen_css'] == 'autogen-inline') {
	$custom_css = get_option('suffusion_generated_css');
	if (!isset($custom_css) || (isset($custom_css) && !is_array($custom_css)) || (is_array($custom_css) && !isset($custom_css['css']))) {
		$custom_css = suffusion_update_generated_css();
		echo "/* CSS generated on the fly */\n";
	}
	else {
		echo "/* CSS retrieved from cache */\n";
	}
	$suffusion_custom_css_string = $custom_css['css'];
}
else {
	$suffusion_custom_css_string = suffusion_generate_all_custom_styles();
}
echo $suffusion_custom_css_string;

// Ensure that if your header background image is a rotating image, it is printed dynamically...
if ($suffusion_unified_options['suf_header_style_setting'] == "custom") {
	if ($suffusion_unified_options['suf_header_image_type'] == "rot-image" && isset($suffusion_unified_options['suf_header_background_rot_folder']) && trim($suffusion_unified_options['suf_header_background_rot_folder']) != '') {
		$header_bg_url = " url(".suffusion_get_rotating_image($suffusion_unified_options['suf_header_background_rot_folder']).") ";
		echo "#header-container { background-image: $header_bg_url; }\n";
	}
}

if (isset($suffusion_unified_options['suf_custom_css_code']) && trim($suffusion_unified_options['suf_custom_css_code']) != "") {
	$included_code = stripslashes($suffusion_unified_options['suf_custom_css_code']);
	$included_code = wp_specialchars_decode($included_code, ENT_QUOTES);
	echo "\n/* Custom CSS code */\n";
	echo $included_code;
	echo "\n/* End Custom CSS code */";
}
?>