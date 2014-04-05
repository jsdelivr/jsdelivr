<?php
global $suffusion_custom_types_options;
$suffusion_custom_types_options = array(
	array("name" => "Custom Types",
		"type" => "sub-section-2",
		"category" => "custom-types",
		"parent" => "root"
	),

	array("name" => "Custom Types",
		"type" => "sub-section-3",
		"category" => "placeholder",
		"buttons" => 'no-buttons',
		"parent" => "custom-types"
	),

	array("name" => "I Have Moved!!",
		"desc" => "With Version 4.0.0 the options for Custom Post Types are no longer included with the theme. You can download the 
			<a href='http://wordpress.org/extend/plugins/suffusion-custom-post-types/'>Suffusion Custom Post Types</a> plugin.
			Even if you don't use the plugin, post types and taxonomies that you previously saved with the theme will continue to operate fine.",
		"parent" => "placeholder",
		"type" => "blurb"),

	array("name" => "Layouts",
		"type" => "sub-section-3",
		"category" => "cpt-layouts",
		"parent" => "custom-types"
	),

	array("name" => "Custom Post Type Layouts",
		"desc" => "Choose how you want to display your custom post types.",
		"id" => "suf_cpt_layouts",
		"parent" => "cpt-layouts",
		"type" => "associative-array",
		"options" => array(
			"Custom Post Type" => suffusion_get_custom_post_types(),
			"Byline Display" => array(
				'name' => 'byline',
				'type' => 'select',
				'options' => array(
					'none' => 'No bylines',
					'line-top' => 'Single line below post title',
					'line-bottom' => 'Single line below post',
					'left-pullout' => 'Pullout on the left',
					'right-pullout' => 'Pullout on the right',
				),
			),
			"Byline Contents" => array(
				'name' => 'byline-contents',
				'type' => 'multi-select',
				'options' => array(
					'date' => 'Date',
					'posted-by' => 'Posted By',
					'comments' => 'Comments',
					'permalink' => 'Permalink',
				),
			),
			"Taxonomies (comma-separated) in bylines" => array(
				'name' => 'tax',
				'type' => 'text',
				'std' => '',
			),
			"CSS classes (comma-separated)" => array(
				'name' => 'styles',
				'type' => 'text',
				'std' => '',
			),
		),
		"std" => ""),
);
?>