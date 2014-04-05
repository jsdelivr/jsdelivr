<?php
/**
 * Builds a navigation menu for the theme. It makes use of the options defined in the "Other Graphical Elements" section and can be used for either menu location.
 * Users can override this in a child theme. Note that if you want to have different menus for the Top and the Main Navigation bars, you can create files called
 * navigation-menu-top.php and navigation-menu-main.php respectively. If either file doesn't exist, this file will be picked.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */

global $suffusion_menu_location, $suffusion_page_option, $suffusion_cats_option, $suffusion_links_option, $suffusion_menus_option, $suffusion_echo_menu;

global $suf_nav_pages_style, $suf_nav_page_tab_title, $suf_nav_page_tab_link, $suf_navt_pages_style, $suf_navt_page_tab_title, $suf_navt_page_tab_link;
global $suf_nav_cat_style, $suf_nav_cat_tab_title, $suf_nav_cat_tab_link, $suf_navt_cat_style, $suf_navt_cat_tab_title, $suf_navt_cat_tab_link;
global $suf_nav_links_style, $suf_nav_links_tab_title, $suf_nav_links_tab_link, $suf_navt_links_style, $suf_navt_links_tab_title, $suf_navt_links_tab_link;
global $suf_nav_entity_order, $suf_navt_entity_order, $suf_nav_pages_all_sel, $suf_nav_cats_all_sel, $suf_nav_links_all_sel, $suf_navt_pages_all_sel, $suf_navt_cats_all_sel, $suf_navt_links_all_sel;
global $suf_nav_menus_all_sel, $suf_navt_menus_all_sel;

switch ($suffusion_menu_location) {
	case 'top':
		$pages_style = $suf_navt_pages_style;
		$page_tab_title = stripslashes($suf_navt_page_tab_title);
		$page_tab_link = $suf_navt_page_tab_link;
		$page_all_sel = $suf_navt_pages_all_sel;
		$cat_style = $suf_navt_cat_style;
		$cat_tab_title = stripslashes($suf_navt_cat_tab_title);
		$cat_tab_link = $suf_navt_cat_tab_link;
		$cat_all_sel = $suf_navt_cats_all_sel;
		$links_style = $suf_navt_links_style;
		$links_tab_title = stripslashes($suf_navt_links_tab_title);
		$links_tab_link = $suf_navt_links_tab_link;
		$link_all_sel = $suf_navt_links_all_sel;
		$menus_all_sel = $suf_navt_menus_all_sel;
		$entity_order = $suf_navt_entity_order;
		break;
	default:
		$pages_style = $suf_nav_pages_style;
		$page_tab_title = stripslashes($suf_nav_page_tab_title);
		$page_tab_link = $suf_nav_page_tab_link;
		$page_all_sel = $suf_nav_pages_all_sel;
		$cat_style = $suf_nav_cat_style;
		$cat_tab_title = stripslashes($suf_nav_cat_tab_title);
		$cat_tab_link = $suf_nav_cat_tab_link;
		$cat_all_sel = $suf_nav_cats_all_sel;
		$links_style = $suf_nav_links_style;
		$links_tab_title = stripslashes($suf_nav_links_tab_title);
		$links_tab_link = $suf_nav_links_tab_link;
		$link_all_sel = $suf_nav_links_all_sel;
		$menus_all_sel = $suf_nav_menus_all_sel;
		$entity_order = $suf_nav_entity_order;
		break;
}
global $$suffusion_page_option, $$suffusion_cats_option, $$suffusion_links_option, $$suffusion_menus_option;

$selected_menus = $$suffusion_menus_option;
$menu_args = array(
	'sort_column' => 'menu_order'
);

if ($menus_all_sel == 'selected') {
	if (trim($selected_menus) == '') {
		$menus_included = array();
	}
	else {
		$menus_included = explode(',', $selected_menus);
	}
}

$menu_locations = get_nav_menu_locations();

if (isset($menus_included) && isset($menu_locations[$suffusion_menu_location])) {
	$menu_in_location = $menu_locations[$suffusion_menu_location];
	if (!in_array($menu_in_location, $menus_included)) {
		$menus_included[] = $menu_in_location;
	}
}

if (isset($menus_included)) {
	if (count($menus_included) == 0) {
		$menus_to_show = array();
	}
	else {
		$menu_args['include'] = $menus_included;
		$menus_to_show = wp_get_nav_menus($menu_args);
	}
}
else {
	$menus_to_show = wp_get_nav_menus($menu_args);
}

$entity_order = suffusion_get_entity_order($entity_order, 'nav');
$entity_order = explode(',', $entity_order);
$home_link = suffusion_get_home_link_html($suffusion_menu_location);
$ret_str = $home_link;
foreach ($entity_order as $entity) {
	if ($entity == 'pages') {
		$selected_pages = $$suffusion_page_option;
		$page_args = array(
			'sort_column' => 'menu_order,post_title',
			'child_of' => 0,
			'echo' => 0,
			'suffusion_nav_display' => $pages_style,
		);

		if ($page_all_sel == 'selected') {
			if (trim($selected_pages) == '') {
				$page_args = array();
			}
			else {
				$page_args['include'] = $selected_pages;
			}
		}
		else if ($page_all_sel == 'exclude-selected') {
			$page_args['exclude'] = $selected_pages;
		}
		else if ($page_all_sel == 'exclude-all') {
			$page_args = array();
		}

		if ($pages_style == 'rolled-up' && count($page_args) != 0) {
			$page_args['title_li'] = "<a href='" . ($page_tab_link == '' ? '#'
					: $page_tab_link) . "'>" . $page_tab_title . "</a>";
		}
		else if ($pages_style == 'flattened' && count($page_args) != 0) {
			$page_args['title_li'] = '';
		}
		if (count($page_args) == 0) {
			$page_str = '';
		}
		else {
			$page_str = wp_list_pages($page_args);
		}
		$ret_str .= $page_str;
	}
	else if ($entity == 'categories') {
		$cat_args = array(
			'orderby' => 'name',
			'order' => 'ASC',
			'child_of' => 0,
			'echo' => 0,
			'current_category' => 0,
		);

		if (function_exists('mycategoryorder')) {
			$cat_args['orderby'] = 'order';
		}

		$selected_cats = $$suffusion_cats_option;
		if ($cat_all_sel == 'selected') {
			if (trim($selected_cats) == '') {
				$cat_args = array();
			}
			else {
				$cat_args['include'] = $selected_cats;
			}
		}
		else if ($cat_all_sel == 'exclude-selected') {
			$cat_args['exclude'] = $selected_cats;
		}
		else if ($cat_all_sel == 'exclude-all') {
			$cat_args = array();
		}

		if ($cat_style == 'rolled-up' && count($cat_args) != 0) {
			$cat_args['title_li'] = "<a href='" . ($cat_tab_link == '' ? '#'
					: $cat_tab_link) . "'>" . $cat_tab_title . "</a>";
		}
		else if ($cat_style == 'flattened' && count($cat_args) != 0) {
			$cat_args['title_li'] = '';
		}

		if (count($cat_args) == 0) {
			$cat_str = '';
		}
		else {
			$cat_str = wp_list_categories($cat_args);
		}
		$ret_str .= $cat_str;
	}
	else if ($entity == 'links') {
		$link_args = array(
			'orderby' => 'name',
			'order' => 'ASC',
			'limit' => -1,
			'echo' => 0,
			'categorize' => 0,
			'title_before' => '',
			'title_after' => '',
		);
		if (function_exists('mylinkorder')) {
			$link_args['orderby'] = 'order';
		}

		$selected_links = $$suffusion_links_option;
		if ($link_all_sel == 'selected') {
			if (trim($selected_links) == '') {
				$link_args = array();
			}
			else {
				$link_args['include'] = $selected_links;
			}
		}
		else if ($link_all_sel == 'exclude-selected') {
			$link_args['exclude'] = $selected_links;
		}
		else if ($link_all_sel == 'exclude-all') {
			$link_args = array();
		}

		if ($links_style == 'rolled-up' && count($link_args) != 0) {
			$link_args['title_li'] = "<a href='" . ($links_tab_link == '' ? '#'
					: $links_tab_link) . "'>" . $links_tab_title . "</a>";
		}
		else if ($links_style == 'flattened' && count($link_args) != 0) {
			$link_args['title_li'] = '';
		}

		if (count($link_args) == 0) {
			$link_str = '';
		}
		else {
			$link_str = wp_list_bookmarks($link_args);
		}
		$ret_str .= $link_str;
	}
	else if ((strlen($entity) >= 5 && substr($entity, 0, 5) == 'menu-')) {
		if (count($menus_to_show) != 0) {
			$menu_print_args = array(
				'container' => '',
				'menu_class' => 'menu',
				'echo' => false,
				'depth' => 0,
				'theme_location' => $suffusion_menu_location,
				'items_wrap' => '%3$s',
			);
			if (current_theme_supports('mega-menus')) {
				$menu_print_args['walker'] = new Suffusion_MM_Walker();
			}
			$menu_str = '';
			$menu_entity_id = (int)substr($entity, 5);
			foreach ($menus_to_show as $menu) {
				if ($menu->term_id != $menu_entity_id) continue;
				$menu_print_args['menu'] = $menu->term_id;
				$this_menu_str = wp_nav_menu($menu_print_args);
				$this_menu_str = preg_replace('/^<ul id="[-a-zA-Z0-9]*" class="menu">/', '', $this_menu_str);
				$this_menu_str = preg_replace('/<\/ul>$/', '', $this_menu_str);
				$menu_str .= $this_menu_str;
			}
			$ret_str .= $menu_str;
		}
	}
}
if (trim($ret_str) != '') {
	$ret_str = "<ul class='sf-menu'>\n" . $ret_str . "\n</ul>\n";
}

if ($suffusion_echo_menu) {
	echo $ret_str;
}
?>