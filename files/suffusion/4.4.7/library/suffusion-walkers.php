<?php
/**
 * Contains the walkers used in Suffusion in the front-end. This is a core file, not extensible by child themes.
 *
 * @package Suffusion
 * @subpackage Library
 * @since 4.0.0
 */

/**
 * Navigation Menu Walker for the front-end. This adds additional processing for Mega-Menu enabled tabs.
 * Only a top-level menu item can be used for a Mega-Menu. Note that the ideal way to implement this would have been using hooks.
 *
 * @since: 4.0.0
 */
class Suffusion_MM_Walker extends Walker_Nav_Menu {
	function start_el(&$output, $item, $depth, $args) {
		if ($depth == 0) {
			$parent_id = $item->menu_item_parent;
			if ($parent_id != 0) {
				return;
			}
		}
		parent::start_el($output, $item, $depth, $args);
	}

	function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output) {
		// For nested levels we want to check if the parent is mega-menu enabled. If so, we shouldn't print the children.
		if ($depth == 1) {
			$parent_id = $element->menu_item_parent;
			$selection = get_post_meta($parent_id, 'suf_mm_warea', true);
			if (isset($selection) && $selection != '') {
				return;
			}
		}
		// If not a mega-menu, display as you would
		parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
	}
}
