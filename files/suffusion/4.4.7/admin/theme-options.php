<?php
/**
 * Lists out all the options in "Suffusion Theme Options".
 * This file is included in functions.php
 *
 * @package Suffusion
 * @subpackage Admin
 */

global $suffusion_inbuilt_options, $suffusion_intro_options, $suffusion_theme_skinning_options, $suffusion_visual_effects_options, $suffusion_custom_types_options;
global $suffusion_sidebars_and_widgets_options, $suffusion_blog_features_options, $suffusion_templates_options, $suffusion_layouts_options, $suffusion_typography_options;

$suffusion_template_path = get_template_directory();
include_once($suffusion_template_path . "/admin/theme-options-intro.php");
include_once($suffusion_template_path . "/admin/theme-options-theme-skinning.php");
include_once($suffusion_template_path . "/admin/theme-options-layouts.php");
include_once($suffusion_template_path . "/admin/theme-options-typography.php");
include_once($suffusion_template_path . "/admin/theme-options-visual-effects.php");
include_once($suffusion_template_path . "/admin/theme-options-sidebars-and-widgets.php");
include_once($suffusion_template_path . "/admin/theme-options-blog-features.php");
include_once($suffusion_template_path . "/admin/theme-options-templates.php");
include_once($suffusion_template_path . "/admin/theme-options-custom-types.php");

$suffusion_inbuilt_options = array();
foreach ($suffusion_intro_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_theme_skinning_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_visual_effects_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_sidebars_and_widgets_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_blog_features_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_templates_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_custom_types_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_layouts_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
foreach ($suffusion_typography_options as $option) {
	$suffusion_inbuilt_options[] = $option;
}
