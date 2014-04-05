<?php
/**
 * Registers any custom post types defined in the theme prior to 4.0.0. Since Custom Post Types have been moved out of the
 * theme to their own plugin, this code is there only for backwards compatibility.
 *
 * @package Suffusion
 * @subpackage Functions
 */

global $suffusion_post_type_labels, $suffusion_post_type_args, $suffusion_post_type_supports, $suffusion_taxonomy_labels, $suffusion_taxonomy_args;

if (!isset($suffusion_post_type_labels)) {
	$suffusion_post_type_labels = array(
		array('name' => 'name', 'type' => 'text', 'desc' => 'Name (e.g. Books)', 'std' => '', 'reqd' => true),
		array('name' => 'singular_name', 'type' => 'text', 'desc' => 'Singular Name (e.g. Book)', 'std' => '', 'reqd' => true),
		array('name' => 'add_new', 'type' => 'text', 'desc' => 'Text for "Add New" (e.g. Add New)', 'std' => ''),
		array('name' => 'add_new_item', 'type' => 'text', 'desc' => 'Text for "Add New Item" (e.g. Add New Book)', 'std' => ''),
		array('name' => 'edit_item', 'type' => 'text', 'desc' => 'Text for "Edit Item" (e.g. Edit Book)', 'std' => ''),
		array('name' => 'new_item', 'type' => 'text', 'desc' => 'Text for "New Item" (e.g. New Book)', 'std' => ''),
		array('name' => 'view_item', 'type' => 'text', 'desc' => 'Text for "View Item" (e.g. View Book)', 'std' => ''),
		array('name' => 'search_items', 'type' => 'text', 'desc' => 'Text for "Search Items" (e.g. Search Books)', 'std' => ''),
		array('name' => 'not_found', 'type' => 'text', 'desc' => 'Text for "Not found" (e.g. No Books Found)', 'std' => ''),
		array('name' => 'not_found_in_trash', 'type' => 'text', 'desc' => 'Text for "Not found in Trash" (e.g. No Books Found in Trash)', 'std' => ''),
		array('name' => 'parent_item_colon', 'type' => 'text', 'desc' => 'Parent Text with a colon (e.g. Book Series:)', 'std' => ''),
	);
}

if (!isset($suffusion_post_type_args)) {
	$suffusion_post_type_args = array(
		array('name' => 'public', 'desc' => 'Public', 'type' => 'checkbox', 'default' => true),
		array('name' => 'publicly_queryable', 'desc' => 'Publicly Queriable', 'type' => 'checkbox', 'default' => true),
		array('name' => 'show_ui', 'desc' => 'Show UI', 'type' => 'checkbox', 'default' => true),
		array('name' => 'query_var', 'desc' => 'Query Variable', 'type' => 'checkbox', 'default' => true),
		array('name' => 'rewrite', 'desc' => 'Rewrite', 'type' => 'checkbox', 'default' => true),
		array('name' => 'hierarchical', 'desc' => 'Hierarchical', 'type' => 'checkbox', 'default' => true),
		array('name' => 'has_archive', 'desc' => 'Archives allowed', 'type' => 'checkbox', 'default' => true),
		array('name' => 'exclude_from_search', 'desc' => 'Exclude from Search', 'type' => 'checkbox', 'default' => true),
		array('name' => 'show_in_nav_menus', 'desc' => 'Show in Navigation menus', 'type' => 'checkbox', 'default' => true),
		array('name' => 'menu_position', 'desc' => 'Menu Position', 'type' => 'text', 'default' => null),
	);
}

if (!isset($suffusion_post_type_supports)) {
	$suffusion_post_type_supports = array(
		array('name' => 'title', 'desc' => 'Title', 'type' => 'checkbox', 'default' => false),
		array('name' => 'editor', 'desc' => 'Editor', 'type' => 'checkbox', 'default' => false),
		array('name' => 'author', 'desc' => 'Author', 'type' => 'checkbox', 'default' => false),
		array('name' => 'thumbnail', 'desc' => 'Thumbnail', 'type' => 'checkbox', 'default' => false),
		array('name' => 'excerpt', 'desc' => 'Excerpt', 'type' => 'checkbox', 'default' => false),
		array('name' => 'trackbacks', 'desc' => 'Trackbacks', 'type' => 'checkbox', 'default' => false),
		array('name' => 'custom-fields', 'desc' => 'Custom Fields', 'type' => 'checkbox', 'default' => false),
		array('name' => 'comments', 'desc' => 'Comments', 'type' => 'checkbox', 'default' => false),
		array('name' => 'revisions', 'desc' => 'Revisions', 'type' => 'checkbox', 'default' => false),
		array('name' => 'page-attributes', 'desc' => 'Page Attributes', 'type' => 'checkbox', 'default' => false),
	);
}

if (!isset($suffusion_taxonomy_labels)) {
	$suffusion_taxonomy_labels = array(
		array('name' => 'name', 'type' => 'text', 'desc' => 'Name (e.g. Genres)', 'std' => '', 'reqd' => true),
		array('name' => 'singular_name', 'type' => 'text', 'desc' => 'Singular Name (e.g. Genre)', 'std' => '', 'reqd' => true),
		array('name' => 'search_items', 'type' => 'text', 'desc' => 'Text for "Search Items" (e.g. Search Genres)', 'std' => ''),
		array('name' => 'popular_items', 'type' => 'text', 'desc' => 'Text for "Popular Items" (e.g. Popular Genres)', 'std' => ''),
		array('name' => 'all_items', 'type' => 'text', 'desc' => 'Text for "All Items" (e.g. All Genres)', 'std' => ''),
		array('name' => 'parent_item', 'type' => 'text', 'desc' => 'Parent Item (e.g. Parent Genre)', 'std' => ''),
		array('name' => 'parent_item_colon', 'type' => 'text', 'desc' => 'Parent Item Colon (e.g. Parent Genre:)', 'std' => ''),
		array('name' => 'edit_item', 'type' => 'text', 'desc' => 'Text for "Edit Item" (e.g. Edit Genre)', 'std' => ''),
		array('name' => 'update_item', 'type' => 'text', 'desc' => 'Text for "Update Item" (e.g. Update Genre)', 'std' => ''),
		array('name' => 'add_new_item', 'type' => 'text', 'desc' => 'Text for "Add New Item" (e.g. Add New Genre)', 'std' => ''),
		array('name' => 'new_item_name', 'type' => 'text', 'desc' => 'Text for "New Item Name" (e.g. New Genre Name)', 'std' => ''),
	);
}

if (!isset($suffusion_taxonomy_args)) {
	$suffusion_taxonomy_args = array(
		array('name' => 'public', 'desc' => 'Public', 'type' => 'checkbox', 'default' => true),
		array('name' => 'show_ui', 'desc' => 'Show UI', 'type' => 'checkbox', 'default' => true),
		array('name' => 'show_tagcloud', 'desc' => 'Show in Tagcloud widget', 'type' => 'checkbox', 'default' => true),
		array('name' => 'hierarchical', 'desc' => 'Hierarchical', 'type' => 'checkbox', 'default' => true),
		array('name' => 'rewrite', 'desc' => 'Rewrite', 'type' => 'checkbox', 'default' => true),
	);
}

$suffusion_post_types = get_option('suffusion_post_types');
$suffusion_taxonomies = get_option('suffusion_taxonomies');
if (is_array($suffusion_post_types)) {
	foreach ($suffusion_post_types as $post_type) {
		$args = array();
		$labels = array();
		$supports = array();
		foreach ($suffusion_post_type_labels as $label) {
			if (isset($post_type['labels'][$label['name']]) && $post_type['labels'][$label['name']] != '') {
				$labels[$label['name']] = $post_type['labels'][$label['name']];
			}
		}
		foreach ($suffusion_post_type_supports as $support) {
			if (isset($post_type['supports'][$support['name']])) {
				if ($post_type['supports'][$support['name']] == '1') {
					$supports[] = $support['name'];
				}
			}
		}
		foreach ($suffusion_post_type_args as $arg) {
			if (isset($post_type['args'][$arg['name']])) {
				if ($arg['type'] == 'checkbox' && $post_type['args'][$arg['name']] == '1' && $arg['name'] == 'has_archive') {
					$args[$arg['name']] = $post_type['post_type'];
				}
				else if ($arg['type'] == 'checkbox' && $post_type['args'][$arg['name']] == '1') {
					$args[$arg['name']] = true;
				}
				else if ($arg['type'] != 'checkbox') {
					$args[$arg['name']] = $post_type['args'][$arg['name']];
				}
			}
		}
		$args['labels'] = $labels;
		$args['supports'] = $supports;
		register_post_type($post_type['post_type'], $args);
	}
}

if (is_array($suffusion_taxonomies)) {
	foreach ($suffusion_taxonomies as $taxonomy) {
		$labels = array();
		$args = array();
		foreach ($suffusion_taxonomy_labels as $label) {
			if (isset($taxonomy['labels'][$label['name']]) && $taxonomy['labels'][$label['name']] != '') {
				$labels[$label['name']] = $taxonomy['labels'][$label['name']];
			}
		}
		foreach ($suffusion_taxonomy_args as $arg) {
			if (isset($taxonomy['args'][$arg['name']])) {
				if ($arg['type'] == 'checkbox' && $taxonomy['args'][$arg['name']] == '1') {
					$args[$arg['name']] = true;
				}
				else if ($arg['type'] != 'checkbox') {
					$args[$arg['name']] = $taxonomy['args'][$arg['name']];
				}
			}
		}
		$args['labels'] = $labels;
		$object_type_str = $taxonomy['object_type'];
		$object_type_array = explode(',',$object_type_str);
		$object_types = array();
		foreach ($object_type_array as $object_type) {
			if (post_type_exists(trim($object_type))) {
				$object_types[] = trim($object_type);
			}
		}
		register_taxonomy($taxonomy['taxonomy'], $object_types, $args);
	}
}
