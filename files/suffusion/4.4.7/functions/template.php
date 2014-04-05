<?php
/**
 * This file contains functions that are only used by the templates (i.e. on the front-end) and not by any admin screen.
 * By isolating these from the functions.php file we reduce the load on the options pages.
 *
 * @package Suffusion
 * @subpackage Functions
 * @since 4.0.0
 */

/**
 * @return void
 */
function suffusion_add_header_contents() {
	suffusion_create_openid_links();
	suffusion_create_additional_feeds();
}

function suffusion_add_footer_contents() {
	//suffusion_create_analytics_contents();
}

// OpenID stuff...
function suffusion_create_openid_links() {
	global $suf_openid_enabled, $suf_openid_server, $suf_openid_delegate;
	if ($suf_openid_enabled == "enabled") {
		echo "<!-- Start OpenID settings -->\n";
		echo "<link rel=\"openid.server\" href=\"".$suf_openid_server."\" />\n";
		echo "<link rel=\"openid.delegate\" href=\"".$suf_openid_delegate."\" />\n";
		echo "<!-- End OpenID settings -->\n";
	}
}
// ... End OpenID stuff

// Analytics ...
function suffusion_create_analytics_contents() {
	global $suf_analytics_enabled, $suf_custom_analytics_code;
	if ($suf_analytics_enabled == "enabled") {
		if (trim($suf_custom_analytics_code) != "") {
			echo "<!-- Start Google Analytics -->\n";
			$strip = stripslashes($suf_custom_analytics_code);
			$strip = wp_specialchars_decode($strip, ENT_QUOTES);
			echo $strip."\n";
			echo "<!-- End Google Analytics -->\n";
		}
	}
}
// ... End Analytics

// Additional Feeds ...
function suffusion_create_additional_feeds() {
	global $suffusion_options;
	echo "<!-- Start Additional Feeds -->\n";
	$feeds = array('rss', 'atom');
	foreach ($feeds as $feed_type) {
		for ($i = 1; $i <= 3; $i++) {
			if (isset($suffusion_options["suf_custom_{$feed_type}_feed_$i"]) && trim($suffusion_options["suf_custom_{$feed_type}_feed_$i"]) != "") {
				echo "<link rel=\"alternate\" type=\"application/{$feed_type}+xml\" title=\"".esc_attr($suffusion_options["suf_custom_{$feed_type}_title_{$i}"])."\" href=\"".$suffusion_options["suf_custom_{$feed_type}_feed_{$i}"]."\" />\n";
			}
		}
	}
	echo "<!-- End Additional Feeds -->\n";
}
// ... End Additional Feeds

function suffusion_get_allowed_categories($prefix) {
	global $suffusion_options;
	$allowed = array();
	if (isset($suffusion_options[$prefix])) {
		$selected = $suffusion_options[$prefix];
		if ($selected && trim($selected) != '') { $selected_categories = explode(',', $selected); } else { $selected_categories = array(); }
		if ($selected_categories && is_array($selected_categories)) {
			foreach ($selected_categories as $category) {
				$allowed[] = get_category($category);
			}
		}
	}
	return $allowed;
}

function suffusion_get_allowed_pages($prefix) {
	global $suffusion_options;
	$allowed = array();
	if (isset($suffusion_options[$prefix])) {
		$selected = $suffusion_options[$prefix];
		if (!empty($selected)) {
			$selected_pages = explode(',', $selected);
			if (is_array($selected_pages) && count($selected_pages) > 0) {
				foreach ($selected_pages as $page_id) {
					$page = get_page($page_id);
					$allowed[] = $page;
				}
			}
		}
	}
	return $allowed;
}

/**
 * Makes a call to include custom-styles.php if a query variable is passed. This is the best alternative to avoiding file open calls in the theme OR dumping CSS in the HTML.
 *
 * @return void
 */
function suffusion_custom_css_display(){
	$css = get_query_var('suffusion-css');
	if ($css == 'css') {
		include_once (get_template_directory() . '/custom-styles.php');
		exit; //This stops WP from loading any further, otherwise wp-load will continue to load the rest of WP in the CSS page
	}
}

/**
 * Adds all stylesheets used by Suffusion. Even conditional stylesheets are loaded, by using the "style_loader_tag" filter hook.
 * The theme version is added as a URL parameter so that when you upgrade the latest version is picked up.
 *
 * @return void
 * @since 3.7.4
 */
function suffusion_enqueue_styles() {
	// We don't want to enqueue any styles if this is not an admin page
	if (is_admin()) {
		return;
	}

	global $suf_style_inheritance, $suffusion_theme_hierarchy, $suf_color_scheme, $suf_show_rounded_corners, $suf_autogen_css;
	if (!isset($suffusion_theme_hierarchy[$suf_color_scheme])) {
		if (@file_exists(get_stylesheet_directory().'/skins/'.$suf_color_scheme.'/skin.css')) {
			$sheets = array('style.css', 'skins/'.$suf_color_scheme.'/skin.css');
		}
		else if (@file_exists(get_template_directory().'/skins/'.$suf_color_scheme.'/skin.css')) {
			$sheets = array('style.css', 'skins/'.$suf_color_scheme.'/skin.css');
		}
		else {
			$sheets = array('style.css');
		}
	}
	else {
		$sheets = $suffusion_theme_hierarchy[$suf_color_scheme];
	}

	$template_path = get_template_directory();
	$stylesheet_path = get_stylesheet_directory();

	// Core styles - either from Suffusion or from its child themes
	if ($suf_style_inheritance == 'nothing' && is_child_theme()) {
		wp_enqueue_style('suffusion-theme', get_stylesheet_uri(), array(), SUFFUSION_THEME_VERSION);
	}
	else {
		wp_enqueue_style("suffusion-theme", get_template_directory_uri().'/style.css', array(), SUFFUSION_THEME_VERSION);

		$skin_count = 0;
		foreach ($sheets as $sheet) {
			if ($sheet == 'style.css') {
				continue;
			}
			if (file_exists($template_path."/$sheet")) {
				$skin_count++;
				wp_enqueue_style("suffusion-theme-skin-{$skin_count}", get_template_directory_uri()."/$sheet", array('suffusion-theme'), SUFFUSION_THEME_VERSION);
			}
		}
		if (is_child_theme()) {
			wp_enqueue_style('suffusion-child', get_stylesheet_uri(), array('suffusion-theme'), SUFFUSION_THEME_VERSION);
		}
	}

	global $suffusion, $suf_mosaic_zoom_library;
	if ($suffusion->get_content_layout() == 'mosaic') {
		if ($suf_mosaic_zoom_library == 'fancybox') {
			if (@file_exists($stylesheet_path.'/scripts/fancybox/jquery.fancybox-1.3.4.css')) {
				wp_enqueue_style("suffusion-slideshow", get_stylesheet_directory_uri().'/scripts/fancybox/jquery.fancybox-1.3.4.css', array(), SUFFUSION_THEME_VERSION);
			}
			else {
				wp_enqueue_style("suffusion-slideshow", get_template_directory_uri().'/scripts/fancybox/jquery.fancybox-1.3.4.css', array(), SUFFUSION_THEME_VERSION);
			}
		}
		else if ($suf_mosaic_zoom_library == 'colorbox') {
			if (@file_exists($stylesheet_path.'/scripts/colorbox/colorbox.css')) {
				wp_enqueue_style("suffusion-slideshow", get_stylesheet_directory_uri().'/scripts/colorbox/colorbox.css', array(), SUFFUSION_THEME_VERSION);
			}
			else {
				wp_enqueue_style("suffusion-slideshow", get_template_directory_uri().'/scripts/colorbox/colorbox.css', array(), SUFFUSION_THEME_VERSION);
			}
		}
	}

	// Attachment styles. Loaded conditionally, because it uses a rather heavy image, which we don't want to load always.
	if (is_attachment()) {
		wp_enqueue_style('suffusion-attachment', get_template_directory_uri().'/attachment-styles.css', array('suffusion-theme'), SUFFUSION_THEME_VERSION);
	}

	// Rounded corners, loaded if the browser is not IE <= 8
	if ($suf_show_rounded_corners == 'show') {
		wp_register_style('suffusion-rounded', get_template_directory_uri().'/rounded-corners.css', array('suffusion-theme'), SUFFUSION_THEME_VERSION);
//		$GLOBALS['wp_styles']->add_data('suffusion_rounded', 'conditional', '!IE'); // Doesn't work (yet). See http://core.trac.wordpress.org/ticket/16118. Instead we will filter style_loader_tag
		wp_enqueue_style('suffusion-rounded');
	}

	// BP admin-bar, loaded only if this is a BP installation
	if (defined('BP_VERSION')) {
		if (substr(BP_VERSION, 0, 3) == '1.6') {
			$stylesheet = WP_PLUGIN_URL.'/buddypress/bp-core/css/buddybar.css';
		}
		else {
			$stylesheet = WP_PLUGIN_URL.'/buddypress/bp-themes/bp-default/_inc/css/adminbar.css';
		}
		wp_enqueue_style('bp-admin-bar', apply_filters('bp_core_admin_bar_css', $stylesheet), array(), BP_VERSION);
	}

	// IE-specific CSS, loaded if the browser is IE < 8
	wp_enqueue_style('suffusion-ie', get_template_directory_uri().'/ie-fix.css', array('suffusion-theme'), SUFFUSION_THEME_VERSION);

	// Custom styles, built based on selected options.
	$css_loaded = false;
	if ($suf_autogen_css == 'autogen-file') {
		$upload_dir = wp_upload_dir();
		$custom_file = trailingslashit($upload_dir['basedir']).'suffusion/custom-styles.css';
		if (@file_exists($custom_file)) {
			$custom_file_url = $upload_dir['baseurl'].'/suffusion/custom-styles.css';
			wp_enqueue_style('suffusion-generated', $custom_file_url, array('suffusion-theme', 'suffusion-ie'), SUFFUSION_THEME_VERSION);
			$css_loaded = true;
		}
	}

	if (($suf_autogen_css == 'autogen' || $suf_autogen_css == 'nogen-link') || (!$css_loaded && $suf_autogen_css == 'autogen-file')) {
		wp_enqueue_style('suffusion-generated?suffusion-css=css', home_url(), array('suffusion-theme', 'suffusion-ie'), SUFFUSION_THEME_VERSION);
	}

	// Custom styles, from included CSS files
	for ($i = 1; $i <= 3; $i++) {
		$var = "suf_custom_css_link_{$i}";
		global $$var;
		if (isset($$var) && trim($$var) != "") {
			wp_enqueue_style('suffusion-included-'.$i, $$var, array('suffusion-theme'), null);
		}
	}
}

/**
 * Prints CSS directly into the source code. This is hooked via wp_head and not via wp_print_styles.
 *
 * @return void
 */
function suffusion_print_direct_styles() {
	global $suf_autogen_css, $suf_custom_css_code, $suf_header_style_setting, $suf_header_image_type, $suf_header_background_rot_folder;
	if ($suf_autogen_css == 'nogen' || $suf_autogen_css == 'autogen-inline') {
?>
	<!-- CSS styles constructed using option definitions -->
	<style type="text/css">
	/* <![CDATA[ */
<?php
		if ($suf_autogen_css == 'nogen') {
			$suffusion_custom_css_string = suffusion_generate_all_custom_styles();
			echo $suffusion_custom_css_string;
		}
		else {
			$generated_css = get_option('suffusion_generated_css');
			if (isset($generated_css) && is_array($generated_css) && isset($generated_css['css'])) {
				echo $generated_css['css'];
			}
			else {
				$suffusion_custom_css_string = suffusion_generate_all_custom_styles();
				echo $suffusion_custom_css_string;
			}
		}

		if (!suffusion_is_sidebar_empty(12)) {
			echo "#wrapper #nav {float: left;}\n";
		}
	?>
	/* ]]> */
	</style>
<?php
	}
	else if (!suffusion_is_sidebar_empty(12)) {
		?>
<!-- CSS styles constructed using option definitions -->
<style type="text/css">
/* <![CDATA[ */
#wrapper #nav {float: left;}
/* ]]> */
</style>
	<?php
	}
	if (isset($suf_custom_css_code) && trim($suf_custom_css_code) != "") { ?>
		<!-- Custom CSS styles defined in options -->
		<style type="text/css">
			/* <![CDATA[ */
<?php
	$strip = stripslashes($suf_custom_css_code);
	$strip = wp_specialchars_decode($strip, ENT_QUOTES);
	echo $strip;
?>
			/* ]]> */
		</style>
		<!-- /Custom CSS styles defined in options -->
<?php
	}

	// Ensure that if your header background image is a rotating image, it is printed dynamically...
	if ($suf_header_style_setting == "custom") {
		if ($suf_header_image_type == "rot-image" && isset($suf_header_background_rot_folder) && trim($suf_header_background_rot_folder) != '') {
			$header_bg_url = " url(".suffusion_get_rotating_image($suf_header_background_rot_folder).") "; ?>
		<!-- Custom CSS styles defined in options -->
<style type="text/css">
	/* <![CDATA[ */
<?php
			echo "#header-container { background-image: $header_bg_url; }\n";
				?>
	/* ]]> */
</style>
<!-- /Custom CSS styles defined in options -->
<?php
		}
	}
}

/**
 * Adds all non-conditional JS files used by Suffusion. Unlike styles, conditional JS files are not loaded because there is no
 * "script_loader_tag" filter hook analogous to the "style_loader_tag" filter hook.
 *
 * @return void
 */
function suffusion_enqueue_scripts() {
	if (is_admin()) {
		return;
	}

	suffusion_include_featured_js();
	suffusion_include_jqfix_js();
	suffusion_include_bp_js();
	suffusion_include_custom_js_files();
	if (suffusion_should_include_dbx()) {
		wp_enqueue_script('suffusion-dbx', get_template_directory_uri() . '/dbx.js', array(), null);
	}
}

/**
 * Prints JS directly in the source code. This is hooked using wp_head instead of wp_print_scripts
 * @return void
 */
function suffusion_print_direct_scripts() {
	suffusion_include_dbx();
	suffusion_include_custom_js('header');
	suffusion_include_audio_player_script();
}

/**
 * Returns the page template associated with a page. If there is no template associated, 'page' is returned. If there is a template,
 * the returned value is page-template-name. E.g. For the Single Left Sidebar the returned value is page-1l-sidebar.
 *
 * @return string
 */
function suffusion_get_page_template() {
	$template = get_page_template();
	$template_directory = get_template_directory();
	if (strlen($template) > strlen($template_directory) && substr($template, 0, strlen($template_directory)) == $template_directory) {
		$stripped_template = substr($template, strlen($template_directory) + 1);
		$stripped_template = str_replace('/', '-', $stripped_template);
		$stripped_template = str_replace('.php', '', $stripped_template);
		if ($stripped_template != 'page') {
			$stripped_template = 'page-'.$stripped_template;
		}
		return $stripped_template;
	}
	else {
		return 'page';
	}
}

/**
 * Returns all occurrences of a shortcode in the post content. Returns false if none is found.
 *
 * @param $shortcode
 * @return array|bool
 */
function suffusion_detect_shortcode($shortcode) {
	global $post;
	$pattern = get_shortcode_regex();
	preg_match_all('/' . $pattern . '/s', $post->post_content, $matches);

	if (is_array($matches) && array_key_exists(2, $matches) && in_array($shortcode, $matches[2])) {
		return $matches;
	}
	return false;
}

/**
 * Returns the post format for the post. For WP < 3.1 it returns 'standard', and for WP >= 3.1 it returns 'standard' for the default
 * format and the actual format otherwise.
 *
 * @return mixed|string
 */
function suffusion_get_post_format() {
	if (!function_exists('get_post_format')) {
		return 'standard';
	}
	$format = get_post_format();
	if (false === $format) {
		return 'standard';
	}
	return $format;
}

/**
 * Gets the link to the Home Page. This is compatible with WPML.
 *
 * @param  $position
 * @return string
 */
function suffusion_get_home_link_html($position) {
	global $suffusion_options, $suffusion_interactive_text_fields;
	$retStr = "";
	$option_name = $position == 'top' ? 'suf_navt_show_home' : 'suf_show_home';
	if (!isset($suffusion_options[$option_name])) {
		$suf_show_home = "none";
	}
	else {
		$suf_show_home = $suffusion_options[$option_name];
	}

	$show_on_front = get_option('show_on_front');
	$class = "";
	if (is_front_page()) {
		$class = " class='current_page_item' ";
	}
	else if (is_home() && $show_on_front == 'posts') {
		$class = " class='current_page_item' ";
	}

	$option_name = $position == 'top' ? 'suf_navt_home_text' : 'suf_home_text';
	$home_link = home_url();
	if (function_exists('icl_get_home_url')) {
		$home_link = icl_get_home_url();
	}
	if ($suf_show_home == "text") {
		if ($suffusion_options[$option_name] === FALSE || $suffusion_options[$option_name] == null) {
			$suf_home_text = "Home";
		}
		else if (trim($suffusion_options[$option_name]) == "") {
			$suf_home_text = "Home";
		}
		else if (function_exists('icl_t')) {
//			$suf_home_text = trim($suffusion_options[$option_name]);
			$suf_home_text = wpml_t('suffusion-interactive', $suffusion_interactive_text_fields[$option_name]."|$option_name", trim($suffusion_options[$option_name]));
		}
		else {
			$suf_home_text = trim($suffusion_options[$option_name]);
		}
		$retStr .= "\n\t\t\t\t\t"."<li $class><a href='".$home_link."'>".$suf_home_text."</a></li>";
	}
	else if ($suf_show_home == "icon") {
		$retStr .= "\n\t\t\t\t\t"."<li $class><a href='".$home_link."'><img src='".get_template_directory_uri()."/images/home-light.png' alt='Home' class='home-icon'/></a></li>";
	}
	return $retStr;
}

function suffusion_create_navigation_html($echo = true, $position = 'main', $page_option = 'suf_nav_pages', $cats_option = 'suf_nav_cats', $links_option = 'suf_nav_links', $menus_option = 'suf_nav_menus') {
	global $suffusion_menu_location, $suffusion_page_option, $suffusion_cats_option, $suffusion_links_option, $suffusion_menus_option, $suffusion_echo_menu;
	$suffusion_menu_location = $position;
	$suffusion_page_option = $page_option;
	$suffusion_cats_option = $cats_option;
	$suffusion_links_option = $links_option;
	$suffusion_menus_option = $menus_option;
	$suffusion_echo_menu = $echo;

	get_template_part('custom/navigation-menu', $suffusion_menu_location);
}

/**
 * If more than one page exists, return TRUE.
 * @return bool
 */
function suffusion_show_page_nav() {
	global $wp_query;
	return ($wp_query->max_num_pages > 1);
}

/**
 * If more than one post exists, return TRUE.
 *
 * @return int
 */
function suffusion_post_count() {
	$post_type = get_query_var('post_type');
	if (!isset($post_type) || $post_type == null || $post_type == '') {
		$post_type = 'post';
	}
	$post_count = wp_count_posts($post_type);
	return $post_count->publish;
}

/* Functions for WPML compatibility */
function suffusion_get_wpml_lang_object_ids($ids_array, $type) {
	if (function_exists('icl_object_id')) {
		$res = array();
		foreach ($ids_array as $id) {
			$trans = wpml_get_object_id($id, $type, false);
			if (!is_null($trans) && !in_array($trans, $res)) {
			    $res[] = $trans;
			}
		}
		return $res;
	}
	return $ids_array;
}
/* End functions for WPML compatibility */

function suffusion_get_excluded_pages($prefix) {
	global $$prefix;
	$inclusions = $$prefix;

	$all_pages = get_all_page_ids();//get_pages('sort_column=menu_order');
	if ($all_pages == null) {
		$all_pages = array();
	}

    if ($inclusions && trim($inclusions) != '') {
        $include = explode(',', $inclusions);
        $translations = suffusion_get_wpml_lang_object_ids($include, 'post');
        foreach ($translations as $translation) {
            $include[] = $translation;
        }
    }
    else {
        $include = array();
    }

	// First we figure out which pages have to be excluded
	$exclude = array();
	foreach ($all_pages as $page) {
		if (!in_array($page, $include)) {
            $exclude[] = $page;
        }
	}
	// Now we need to figure out if these excluded pages are ancestors of any pages on the list. If so, we remove the descendants
	foreach ($all_pages as $page) {
		$ancestors = get_ancestors($page, 'page');
		foreach ($ancestors as $ancestor) {
			if (in_array($ancestor, $exclude)) {
				$exclude[] = $page;
			}
		}
	}

	$exclusion_list = implode(",", $exclude);
	return $exclusion_list;
}

/**
 * Caches the postmeta information specific to Suffusion upfront. This eases up the number of queries involving get_post_meta.
 * This is particularly useful for the navigation bar.
 *
 * @return void
 * @since 3.8.3
 */
function suffusion_query_post_meta() {
	if (is_admin()) {
		return;
	}
	global $wpdb;
	$query = "SELECT wposts.ID, wpostmeta.meta_key, wpostmeta.meta_value
		FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta
		WHERE wposts.ID = wpostmeta.post_id
	    AND (wpostmeta.meta_key LIKE 'suf_%' OR wpostmeta.meta_key LIKE 'suffusion_%' OR wpostmeta.meta_key IN ('thumbnail', 'featured_image', 'meta_description', 'meta_keywords'))
	    AND wposts.post_status = 'publish'";

	$meta_by_id = array();
	$meta_by_key = array();

	$meta_results = $wpdb->get_results($query, ARRAY_A);
	foreach ($meta_results as $result) {
		if (isset($meta_by_id[$result['ID']])) {
			$metas_by_id = $meta_by_id[$result['ID']];
		}
		else {
			$metas_by_id = array();
		}

		if (isset($meta_by_key[$result['meta_key']])) {
			$metas_by_key = $meta_by_key[$result['meta_key']];
		}
		else {
			$metas_by_key = array();
		}

		$metas_by_id[$result['meta_key']] = $result['meta_value'];
		$meta_by_id[$result['ID']] = $metas_by_id;

		$metas_by_key[$result['ID']] = $result['meta_value'];
		$meta_by_key[$result['meta_key']] = $metas_by_key;
	}

	global $suffusion_meta_fields_by_id, $suffusion_meta_fields_by_key;
	$suffusion_meta_fields_by_id = $meta_by_id;
	$suffusion_meta_fields_by_key = $meta_by_key;
}

/**
 * Fetches a specific meta field for a post.
 *
 * @param $id
 * @param $meta_key
 * @param bool $single
 * @return bool|mixed
 * @since 3.8.3
 */
function suffusion_get_post_meta($id, $meta_key, $single = false) {
	global $suffusion_meta_fields_by_id;
	$old_keys = array(
		'suf_thumbnail' => 'thumbnail',
		'suf_featured_image' => 'featured_image',
		'suf_meta_keywords' => 'meta_keywords',
		'suf_meta_description' => 'meta_description',
	);
	if (!isset($suffusion_meta_fields_by_id)) {
		suffusion_query_post_meta();
	}
	if (isset($suffusion_meta_fields_by_id) && isset($suffusion_meta_fields_by_id[$id])) {
		if (isset($suffusion_meta_fields_by_id[$id][$meta_key])) {
			return $suffusion_meta_fields_by_id[$id][$meta_key];
		}
		else if (isset($old_keys[$meta_key]) && isset($suffusion_meta_fields_by_id[$id][$old_keys[$meta_key]])) {
			return $suffusion_meta_fields_by_id[$id][$old_keys[$meta_key]];
		}
		else {
			return false;
		}
	}
	else {
		return get_post_meta($id, $meta_key, $single);
	}
}

function suffusion_get_entity_order($entity_order, $entity_type='nav') {
    $ret = array();
    if (is_array($entity_order)) {
        foreach ($entity_order as $element => $element_value) {
            $ret[] = $element;
        }
        $ret = implode(',',$ret);
    }
    else {
        $defaults = suffusion_entity_prepositions($entity_type);
        $ret = explode(',', $entity_order);
        $default_array = array();
        foreach ($defaults as $default_key => $default_value) {
            $default_array[] = $default_key;
            if (!in_array($default_key, $ret)) {
                $ret[] = $default_key;
            }
        }
        $ret_array = array();
        foreach ($ret as $ret_entry) {
            if (in_array($ret_entry, $default_array)) {
                $ret_array[] = $ret_entry;
            }
        }
        $ret = implode(',', $ret_array);
    }
    return $ret;
}

/**
 * Displays a list of user profile links for a user. This is used in the Author Information section of the author profile page
 * and is for facilitating rich snippets.
 *
 * @param int $id
 * @return string
 */
function suffusion_get_author_profile_links($id = 0) {
	global $suffusion_social_networks;
	$ret = '';
	foreach ($suffusion_social_networks as $network => $desc) {
		$link = get_the_author_meta($network, $id);
		if ($link != '') {
			$ret .= "<li><span class='$network icon'>&nbsp;</span><a href='$link' rel='me' class='$network'>$desc</a></li>\n";
		}
	}
	if ($ret != '') {
		$ret = "<ul class='user-profiles fix'>\n$ret</ul>\n";
	}
	return apply_filters('suffusion_author_profile_links', $ret);
}

/**
 * Returns the count for the number of posts to be displayed as full posts.
 *
 * @return int
 */
function suffusion_get_full_content_count() {
	global $suffusion, $suf_category_fc_number, $suf_author_fc_number, $suf_tag_fc_number, $suf_search_fc_number, $suf_archive_fc_number, $suf_index_fc_number, $suf_pop_fc_number, $suf_fc_view_first_only;
	global $suffusion_cpt_post_id;

	if (isset($suffusion_cpt_post_id)) {
		$not_first_page_only = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_full_posts_fp_only', true);
		if (!$not_first_page_only && is_paged()) {
			return 0;
		}

		$full_post_count = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_full_posts', true);
		$total_posts = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_total_posts', true);
		if (!$total_posts || !is_integer($total_posts)) {
			$total_posts = get_option('posts_per_page');
		}

		if (suffusion_admin_check_integer($full_post_count) && $full_post_count > $total_posts) {
			return $total_posts;
		}
		else if (suffusion_admin_check_integer($full_post_count)) {
			return $full_post_count;
		}
		else {
			return 0;
		}
	}

	if ($suf_fc_view_first_only == 'first' && is_paged()) {
		return 0;
	}

	if (!isset($suffusion) || is_null($suffusion)) {
		$suffusion = new Suffusion();
	}
	$context = $suffusion->get_context();
	$full_post_count = 0;
	if (in_array('category', $context)) {
		$full_post_count = (int)$suf_category_fc_number;
	}
	else if (in_array('author', $context)) {
		$full_post_count = (int)$suf_author_fc_number;
	}
	else if (in_array('tag', $context)) {
		$full_post_count = (int)$suf_tag_fc_number;
	}
	else if (in_array('search', $context)) {
		$full_post_count = (int)$suf_search_fc_number;
	}
	else if (in_array('date', $context)) {
		$full_post_count = (int)$suf_archive_fc_number;
	}
	else if (in_array('custom-type', $context)) {
		//
	}
	else if (in_array('home', $context) || in_array('blog', $context)) {
		$full_post_count = (int)$suf_index_fc_number;
	}
	else if (in_array('page', $context)) {
		if (in_array('posts.php', $context)) {
			$full_post_count = (int)$suf_pop_fc_number;
		}
	}

	return $full_post_count;
}

/**
 * Prints a mega menu corresponding to a menu tab. This essentially prints out the widget area associated with the menu tab.
 * Mega-menus are not applicable to any tab that is not at a root-level
 *
 * @param $item_output
 * @param $item
 * @param $depth
 * @param $args
 * @return string
 */
function suffusion_mega_menu_walker($item_output, $item, $depth, $args) {
	if ($depth == 0 && isset ($args->walker)) {
		// If we don't check for the walker, the widget areas start affecting the "Custom Menu" widgets too.
		// The Walker is associated only with the drop-downs, hence we verify before printing the widget areas
		if (class_exists('Suffusion_MM_Walker') && is_a($args->walker, 'Suffusion_MM_Walker')) {
			$warea = suffusion_get_post_meta($item->ID, 'suf_mm_warea', true);
			if (isset($warea) && $warea != '' && !suffusion_is_sidebar_empty($warea)) {
				ob_start(); // Need output buffering here, otherwise we cannot print the widget area in the menu.
				$cols = suffusion_get_post_meta($item->ID, 'suf_mm_cols');
				if ($cols == '' || $cols == 0 || $cols == '0') {
					$cols = 5;
				}

				$widget_height = suffusion_get_post_meta($item->ID, 'suf_mm_widget_height');
				if ($widget_height) {
					$mason_class = 'mm-'.$widget_height;
				}
				else {
					$mason_class = 'mm-row-equal';
				}

				echo "<div class='mm-warea mm-warea-$cols mm-warea-{$item->ID}'>\n";
				echo "<div class='$mason_class mm-row-$cols'>\n";
				dynamic_sidebar('sidebar-'.$warea);
				echo "</div>\n";
				echo "</div>\n";
				$content = ob_get_contents();
				ob_end_clean();
				return $item_output.$content;
			}
		}
	}
	return $item_output;
}

/**
 * Returns the byline position for a custom post type archive display.
 *
 * @param $byline_position
 * @return bool|mixed
 */
function suffusion_cpt_byline_position($byline_position) {
	global $suffusion_cpt_post_id;
	if (!isset($suffusion_cpt_post_id)) {
		return $byline_position;
	}

	$cpt_byline_position = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_byline_type', true);
	if ($cpt_byline_position) {
		return $cpt_byline_position;
	}
	return $byline_position;
}

/**
 * Prints custom taxonomies in the byline for the tiled layout. Two filters are provided, <code>suffusion_before_tax_term_list</code>
 * and <code>suffusion_after_tax_term_list</code> to let child themes print things before and after taxonomy list. An additional filter
 * <code>suffusion_tax_term_separator</code> is provided to override the default "," separator.
 *
 * @param $post_id
 * @param string $ret_trailer
 * @return string
 */
function suffusion_cpt_tile_taxonomies($post_id, $ret_trailer = '') {
	$taxonomies = suffusion_get_post_meta($post_id, 'suf_cpt_byline_taxonomies', true);
	if ($taxonomies) {
		global $post;
		$taxonomies = explode(',', $taxonomies);
		$taxonomies = array_map('trim', $taxonomies);
		foreach ($taxonomies as $taxonomy) {
			$taxonomy = get_taxonomy($taxonomy);
			$terms = get_the_term_list($post->ID, $taxonomy->name, apply_filters('suffusion_before_tax_term_list', '', 'tile', $taxonomy->name), apply_filters('suffusion_tax_term_separator', ', ', 'tile', $taxonomy->name), apply_filters('suffusion_after_tax_term_list', '', 'tile', $taxonomy->name));
			if (strlen(trim($terms)) != 0) {
				$icon_a = "<a id='suf-tile-tax-{$taxonomy->name}-{$post->ID}' class='suf-tile-tax-{$taxonomy->name}-icon suf-tile-tax-icon suf-tile-icon' href='#' title=\"".esc_attr($taxonomy->label)."\"><span>&nbsp;</span></a>";
				echo "<li>$icon_a</li>\n";
				$ret_trailer .= "<li id='suf-tile-tax-{$taxonomy->name}-text-{$post->ID}' class='suf-tile-tax-{$taxonomy->name}-icon-text suf-tile-tax-icon-text suf-tile-icon-text'><span class='icon'>&nbsp;</span>";
				$ret_trailer .= $terms;
				$ret_trailer .= "</li>\n";
			}
		}
	}
	return $ret_trailer;
}

/**
 * Prints custom taxonomies in the byline where the byline is styled as a line. Two filters are provided, <code>suffusion_before_tax_term_list</code>
 * and <code>suffusion_after_tax_term_list</code> to let child themes print things before and after taxonomy list. An additional filter
 * <code>suffusion_tax_term_separator</code> is provided to override the default "," separator.
 *
 * @param $post_id
 * @param bool $is_single_cpt
 * @param string $before
 * @param string $after
 */
function suffusion_cpt_line_taxonomies($post_id, $is_single_cpt = false, $before = '', $after = '') {
	global $post, $suffusion_cpt_layouts, $suf_byline_before_after_cpt_taxonomies;

	if (isset($suf_byline_before_after_cpt_taxonomies)) {
		$suffusion_byline_before_after_cpt_taxonomies = suffusion_get_associative_array($suf_byline_before_after_cpt_taxonomies);
	}

	if (!$is_single_cpt) {
		$taxonomies = suffusion_get_post_meta($post_id, 'suf_cpt_byline_taxonomies', true);
		if ($taxonomies) {
			global $post;
			$taxonomies = explode(',', $taxonomies);
			$taxonomies = array_map('trim', $taxonomies);
		}
	}
	else {
		if ($post->post_type != 'post' && isset($suffusion_cpt_layouts[$post->post_type]) && isset($suffusion_cpt_layouts[$post->post_type]['tax']) && trim($suffusion_cpt_layouts[$post->post_type]['tax']) != '') {
			$taxonomies = explode(',', $suffusion_cpt_layouts[$post->post_type]['tax']);
			$taxonomies = array_map('trim', $taxonomies);
		}
	}
	if (isset($taxonomies) && is_array($taxonomies)) {
		foreach ($taxonomies as $taxonomy) {
			$taxonomy = get_taxonomy($taxonomy);
			$terms = get_the_term_list($post->ID, $taxonomy->name, apply_filters('suffusion_before_tax_term_list', '', 'line', $taxonomy->name), apply_filters('suffusion_tax_term_separator', ', ', 'line', $taxonomy->name), apply_filters('suffusion_after_tax_term_list', '', 'line', $taxonomy->name));
			if (strlen(trim($terms)) != 0) {
				echo $before;
				echo "<span class='tax-{$taxonomy->name} tax'><span class='icon'>&nbsp;</span>";
				if (isset($suffusion_byline_before_after_cpt_taxonomies) && isset($suffusion_byline_before_after_cpt_taxonomies[$taxonomy->name])) {
					$prepend = isset($suffusion_byline_before_after_cpt_taxonomies[$taxonomy->name]['before']) ?
							apply_filters('suffusion_before_byline_html', do_shortcode($suffusion_byline_before_after_cpt_taxonomies[$taxonomy->name]['before']), $taxonomy->name) : '';
					$append = isset($suffusion_byline_before_after_cpt_taxonomies[$taxonomy->name]['after']) ?
							apply_filters('suffusion_after_byline_html', do_shortcode($suffusion_byline_before_after_cpt_taxonomies[$taxonomy->name]['after']), $taxonomy->name) : '';
				}
				else {
					$prepend = '';
					$append = '';
				}

				echo $prepend.$terms.$append;
				echo "</span>";
				echo $after;
			}
		}
	}
}
