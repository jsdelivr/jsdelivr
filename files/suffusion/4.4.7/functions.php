<?php
/**
 * Core functions file for the theme. Includes other key files.
 *
 * @package Suffusion
 * @subpackage Functions
 */

if (!defined('SUFFUSION_THEME_VERSION')) {
	define('SUFFUSION_THEME_VERSION', '4.4.7');
}

require_once(get_template_directory().'/functions/framework.php');
$suffusion_framework = new Suffusion_Framework();

require_once(get_template_directory().'/admin/theme-definitions.php');

add_action("after_setup_theme", "suffusion_theme_setup");

/**
 * Initializing action. If you are creating a child theme and you want to override some of Suffusion's actions/filters etc you
 * can add your own action to the hook "after_setup_theme", with a priority > 10 if you want your actions to be executed after
 * Suffusion and with priority < 10 if you want your actions executed before.
 *
 * @return void
 */
function suffusion_theme_setup() {
	global $pagenow, $suffusion_unified_options, $suffusion;
	suffusion_add_theme_supports();
	suffusion_include_files();
	suffusion_setup_standard_actions_and_filters();
	suffusion_setup_custom_actions_and_filters();
	suffusion_setup_skin();
	foreach ($suffusion_unified_options as $option => $value) {
		global $$option;
		$$option = $value;
	}

	$suffusion = new Suffusion();
	$suffusion->init();

	if(is_admin() && isset($_GET['activated']) && $pagenow = 'themes.php') {
		header('Location: '.admin_url().'themes.php?page=suffusion-options-manager&now-active=true');
	}
}

/**
 * Add support for various theme functions
 * @return void
 */
function suffusion_add_theme_supports() {
	add_theme_support('post-thumbnails');
	add_theme_support('menus');
	add_theme_support('automatic-feed-links');

	// Adding post formats, so that users can assign formats to posts. They will be styled in a later release.
	add_theme_support('post-formats', array('aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat'));

	//Suffusion-specific
	add_theme_support('mega-menus');

	// Support for page excerpts
	add_post_type_support('page', 'excerpt');

	// Additional options for Suffusion. This shows the meta box below posts
	add_theme_support('suffusion-additional-options');

	// Support for native custom headers and backgrounds
	global $wp_version;
    $header_args = array(
        'wp-head-callback' => 'suffusion_header_style',
        'admin-head-callback' => 'suffusion_admin_header_style',
        'admin-preview-callback' => 'suffusion_admin_header_image',
        'random-default' => false,
    );

    $body_args = array();
    $options = get_option('suffusion_options');
    $theme_name = suffusion_get_theme_name();
    if (!isset($options) || !is_array($options) || $theme_name == 'root') {
        $header_args['default-text-color'] = '000';
        $header_args['width'] = apply_filters('suffusion_header_image_width', 1000);
        $header_args['height'] = apply_filters('suffusion_header_image_height', 55);
        $header_args['flex-width'] = false;

        $body_args['default-color'] = '444444';
        $body_args['default-image'] = '';
    }
    else {
        $defaults = array(
            'suf_size_options' => 'custom', // custom || theme
            'suf_wrapper_width_type' => 'fixed', // fixed || fluid
            'suf_wrapper_width_preset' => '1000', // custom || custom-components
            'suf_wrapper_width' => '1000', // if suf_wrapper_width_preset == custom
            'suf_main_col_width' => '725', // if suf_wrapper_width_preset == custom-components
            'suf_sb_1_width' => '260', // if suf_wrapper_width_preset == custom-components
            'suf_sb_2_width' => '260', // if suf_wrapper_width_preset == custom-components

            'suf_header_layout_style' => 'theme', // out-hcfull || out-hcalign || out-cfull-halign || in-align

            'suf_header_style_setting' => 'theme', // custom
            'suf_blog_title_color' => suffusion_evaluate_style('suf_blog_title_color', $theme_name),
            'suf_header_height' => '55', // option check: suf_header_style_setting

            'suf_body_style_setting' => 'theme', // custom
            'suf_body_background_color' => suffusion_evaluate_style('suf_body_background_color', $theme_name),
            'suf_body_background_image' => suffusion_evaluate_style('suf_body_background_image', $theme_name, 'empty'),
        );
        $options = wp_parse_args((array)$options, $defaults);

        if ($options['suf_header_style_setting'] == 'custom') {
            $header_args['height'] = $options['suf_header_height'] + 30;
            $header_args['default-text-color'] = ltrim($options['suf_blog_title_color'], '#');
        }
        else {
            $header_args['height'] = 55 + 30;
            $header_args['default-text-color'] = ltrim(suffusion_evaluate_style("suf_blog_title_color", $theme_name), '#');
        }

        if ($options['suf_header_layout_style'] == 'theme') {
            if ($theme_name == 'minima') {
                $options['suf_header_layout_style'] = 'out-cfull-halign';
            }
            else {
                $options['suf_header_layout_style'] = 'in-align';
            }
        }

        if ($options['suf_header_layout_style'] == 'out-cfull-halign') {
            $header_args['flex-width'] = true;
        }
        else {
            if ($options['suf_size_options'] == 'theme') {
                $header_args['width'] = apply_filters('suffusion_header_image_width', 1000);
                $header_args['flex-width'] = false;
            }
            else {
                if ($options['suf_wrapper_width_type'] == 'fixed') {
                    $header_args['flex-width'] = false;
                    if ($options['suf_wrapper_width_preset'] != 'custom' && $options['suf_wrapper_width_preset'] != 'custom-components') {
                        $header_args['width'] = $options['suf_wrapper_width_preset'];
                    }
                    else if ($options['suf_wrapper_width_preset'] != 'custom') {
                        $header_args['width'] = $options['suf_wrapper_width'];
                    }
                    else {
                        $header_args['width'] = $options['suf_main_col_width'] + $options['suf_sb_1_width'] + $options['suf_sb_2_width'];
                    }
                }
                else {
                    $header_args['flex-width'] = true;
                }
            }
        }

        if ($options['suf_body_style_setting'] == 'custom') {
            $body_args['default-color'] = ltrim($options['suf_body_background_color'], '#');
            $body_args['default-image'] = $options['suf_body_background_image'];
        }
        else {
            $body_args['default-color'] = ltrim(suffusion_evaluate_style('suf_body_background_color', $theme_name), '#');
            $body_args['default-image'] = suffusion_evaluate_style('suf_body_background_image', $theme_name, 'empty');
        }
    }

    add_theme_support('custom-header', $header_args);
    add_theme_support('custom-background', $body_args);
}

/**
 * Include other core files. Some files like theme-options.php are included only on demand, because they are too
 * heavy for every load.
 *
 * @return void
 */
function suffusion_include_files() {
	global $suffusion_unified_options, $suffusion_interactive_text_fields;
	$template_path = get_template_directory();

	$suffusion_unified_options = suffusion_get_unified_options();
	if (function_exists('icl_t')) {
		$suffusion_interactive_text_fields = suffusion_get_interactive_text_fields();
	}

	include_once ($template_path . '/widgets/suffusion-widgets.php');
	$widgets = new Suffusion_Widgets();
	$widgets->init();

	if (function_exists('icl_t')) {
		include_once ($template_path . "/functions/wpml-integration.php");
	}
	require_once ($template_path . "/suffusion.php");
}

/**
 * Adds actions and filters to standard action hooks and filter hooks.
 * 
 * @return void
 */
function suffusion_setup_standard_actions_and_filters() {
	add_action('init', 'suffusion_register_jquery');
	add_action('init', 'suffusion_register_custom_types');
	add_action('init', 'suffusion_register_menus');

	// Make sure that the generated CSS is written out to the right option at the end of the load.
	add_action('wp_loaded', 'suffusion_update_generated_css', 11);

	// Required for WP-MS, 3.0+
	add_action('before_signup_form', 'suffusion_pad_signup_form_start');
	add_action('after_signup_form', 'suffusion_pad_signup_form_end');

	if (!is_admin()) {
		add_action('wp_print_styles', 'suffusion_disable_plugin_styles');
	}

	add_action('custom_header_options', 'suffusion_custom_header_options');
	add_action('customize_register', 'suffusion_customize_register');

	////// FILTERS - The callbacks are in filters.php
	add_filter('extra_theme_headers', 'suffusion_extra_theme_headers');

	add_filter('user_contactmethods', 'suffusion_add_user_contact_methods');

	add_filter('widget_text', 'do_shortcode');

	if (!is_admin()) {
		if (current_theme_supports('mega-menus')) {
			add_filter('walker_nav_menu_start_el', 'suffusion_mega_menu_walker', 10, 4);
		}

		add_action('wp_enqueue_scripts', 'suffusion_enqueue_styles');
		add_action('wp_enqueue_scripts', 'suffusion_enqueue_scripts');

		add_action('wp_head', 'suffusion_add_header_contents');
		add_action('wp_head', 'suffusion_print_direct_styles', 11);
		add_action('wp_head', 'suffusion_print_direct_scripts', 11);
		add_action('wp_head', 'suffusion_create_analytics_contents', 30);
		remove_action('wp_head', 'wp_generator');

		add_action('wp_footer', 'suffusion_add_footer_contents');

		add_action('template_redirect', 'suffusion_custom_css_display');

		add_filter('get_pages', 'suffusion_replace_page_with_alt_title');
		add_filter('wp_list_pages', 'suffusion_js_for_unlinked_pages');
		add_filter('wp_list_pages', 'suffusion_remove_a_title_attribute');
		add_filter('wp_list_categories', 'suffusion_remove_a_title_attribute');
		add_filter('wp_list_bookmarks', 'suffusion_remove_a_title_attribute');

		add_filter('query_vars', 'suffusion_new_vars');
		add_filter('page_link', 'suffusion_unlink_page', 10, 2);

		add_filter('the_content_more_link', 'suffusion_set_more_link');
		add_filter('the_content', 'suffusion_pages_link', 8);
		add_filter('excerpt_more', 'suffusion_excerpt_more_replace');
		add_filter('the_excerpt', 'suffusion_excerpt_more_append');

		add_filter('comment_reply_link', 'suffusion_hide_reply_link_for_pings', 10, 4);
		add_filter('get_comments_number', 'suffusion_filter_trk_ping_from_count');
		add_filter('get_comments_pagenum_link', 'suffusion_append_comment_type');

		add_filter('style_loader_tag', 'suffusion_filter_rounded_corners_css', 10, 2);
		add_filter('style_loader_tag', 'suffusion_filter_ie_css', 10, 2);
		add_filter('post_class', 'suffusion_extra_post_classes');

		add_filter('nav_menu_css_class', 'suffusion_mm_nav_css', 10, 3);

		add_filter('body_class', 'suffusion_get_body_classes', 10, 2);
		add_filter('body_class', 'suffusion_get_width_classes', 10, 2);

		add_filter('pre_get_posts', 'suffusion_custom_taxonomy_contents');
		add_filter('wp_title', 'suffusion_modify_title', 10, 3);
	}
}

/**
 * Adds actions and filters to custom action hooks and filter hooks.
 * 
 * @return void
 */
function suffusion_setup_custom_actions_and_filters() {
	///// ACTIONS
	add_action('suffusion_document_header', 'suffusion_include_responsive_meta');
	add_action('suffusion_document_header', 'suffusion_include_ie7_compatibility_mode');
	add_action('suffusion_document_header', 'suffusion_set_title');
	add_action('suffusion_document_header', 'suffusion_include_meta');
	add_action('suffusion_document_header', 'suffusion_include_favicon');
	add_action('suffusion_document_header', 'suffusion_include_default_feed');

	add_action('suffusion_before_begin_wrapper', 'suffusion_display_open_header');

	add_action('suffusion_after_begin_wrapper', 'suffusion_display_closed_header');
	add_action('suffusion_after_begin_wrapper', 'suffusion_print_widget_area_below_header');

	add_action('suffusion_page_header', 'suffusion_display_header');
	add_action('suffusion_page_header', 'suffusion_display_main_navigation');

	add_action('suffusion_before_begin_content', 'suffusion_build_breadcrumb');
	add_action('suffusion_before_begin_content', 'suffusion_featured_posts');
	add_action('suffusion_after_begin_content', 'suffusion_template_specific_header');

	add_action('suffusion_content', 'suffusion_excerpt_or_content');

	add_action('suffusion_after_begin_post', 'suffusion_print_post_page_title');
	add_action('suffusion_after_begin_post', 'suffusion_print_post_format_icon');
	add_action('suffusion_after_begin_post', 'suffusion_print_post_updated_information');
	add_action('suffusion_after_begin_post', 'suffusion_print_line_byline_top');

	add_action('suffusion_after_content', 'suffusion_meta_pullout');

	add_action('suffusion_before_end_post', 'suffusion_author_information');
	add_action('suffusion_before_end_post', 'suffusion_post_footer');
	add_action('suffusion_before_end_post', 'suffusion_print_line_byline_bottom');

	add_action('suffusion_before_post', 'suffusion_start_outer_pullout_div', 8, 3);
	add_action('suffusion_after_post', 'suffusion_print_outer_pullout', 12, 3);
	add_action('suffusion_after_post', 'suffusion_close_outer_pullout_div', 15, 3);

	add_action('suffusion_before_end_content', 'suffusion_pagination');

	// Print sidebars
	add_action('suffusion_before_end_container', 'suffusion_print_left_sidebars');
	add_action('suffusion_before_end_container', 'suffusion_print_right_sidebars');

	add_action('suffusion_after_end_container', 'suffusion_print_widget_area_above_footer');

	add_action('suffusion_page_footer', 'suffusion_display_footer');

	add_action('suffusion_document_footer', 'suffusion_include_custom_js');

	add_action('suffusion_skin_setup_photonique', 'suffusion_skin_setup_specific');
	add_action('suffusion_skin_setup_scribbles', 'suffusion_skin_setup_specific');

	///// FILTERS
	add_filter('suffusion_can_display_attachment', 'suffusion_filter_attachment_display', 10, 4);
	add_filter('suffusion_left_sidebar_count', 'suffusion_get_sidebar_count_for_view', 10, 3);
	add_filter('suffusion_right_sidebar_count', 'suffusion_get_sidebar_count_for_view', 10, 3);

	add_filter('suffusion_after_comment_form', 'suffusion_allowed_html_tags');
}

function suffusion_setup_skin() {
	global $suffusion_theme_name;
	if (isset($suffusion_theme_name)) {
		do_action("suffusion_skin_setup_{$suffusion_theme_name}");
	}
}

function suffusion_skin_setup_specific() {
	add_action('wp_enqueue_scripts', 'suffusion_enqueue_skin_scripts');
}

function suffusion_enqueue_skin_scripts() {
	global $suffusion_theme_name;
	if (isset($suffusion_theme_name) && $suffusion_theme_name == 'photonique') {
		wp_enqueue_style('suffusion-skin-fonts', "http://fonts.googleapis.com/css?family=Quattrocento", array(), null);
	}
	else if (isset($suffusion_theme_name) && $suffusion_theme_name == 'scribbles') {
		wp_enqueue_style('suffusion-skin-fonts', "http://fonts.googleapis.com/css?family=Coming+Soon", array(), null);
	}
}

function suffusion_admin_check_integer($val) {
	if (substr($val, 0, 1) == '-') {
		$val = substr($val, 1);
	}
	return (preg_match('/^\d*$/', $val) == 1);
}

function suffusion_admin_get_size_from_field($val, $default, $allow_blank = true, $offset = 0) {
	$ret = $default;
	if (substr(trim($val), -2) == "px") {
		$test_str = trim(substr(trim($val), 0, strlen(trim($val)) - 2));
		if (suffusion_admin_check_integer($test_str)) {
			$test_str = (int)$test_str;
			$test_str = $test_str + $offset;
			$ret = $test_str."px";
		}
	}
	else if (suffusion_admin_check_integer(trim($val))) {
		if (!$allow_blank) {
			if (trim($val) != '') {
				$test_str = (int)trim($val);
				$test_str = $test_str + $offset;
				$ret = $test_str."px";
			}
		}
		else {
			$test_str = (int)trim($val);
			$test_str = $test_str + $offset;
			$ret = $test_str."px";
		}
	}
	return $ret;
}

function suffusion_get_numeric_size_from_field($val, $default) {
	$ret = $default;
	if (substr(trim($val), -2) == "px") {
		$test_str = trim(substr(trim($val), 0, strlen(trim($val)) - 2));
		if (suffusion_admin_check_integer($test_str)) {
			$ret = (int)$test_str;
		}
	}
	else if (suffusion_admin_check_integer(trim($val))) {
		$ret = (int)(trim($val));
	}
	return $ret;
}

function suffusion_tab_array_prepositions() {
    global $suffusion_sidebar_tabs;
    $ret = array();
    foreach ($suffusion_sidebar_tabs as $key => $value) {
        $ret[$key] = $value['title'];
    }
    return $ret;
}

function suffusion_entity_prepositions($entity_type = 'nav') {
	if ($entity_type == 'nav') {
		$ret = array('pages' => 'Pages', 'categories' => 'Categories', 'links' => 'Links');
		$menus = wp_get_nav_menus();
		if ($menus == null) {
			$menus = array();
		}

		foreach ($menus as $menu) {
			$ret["menu-".$menu->term_id] = $menu->name;
		}
	}
	else if ($entity_type == 'nr') {
		$ret = array('current' => 'Currently Reading', 'unread' => 'Not Yet Read', 'completed' => 'Completed');
	}
	else if ($entity_type == 'mag-layout') {
		$ret = array('headlines' => 'Headlines', 'excerpts' => 'Excerpts', 'categories' => 'Categories');
	}
	else if ($entity_type == 'thumb-mag-excerpt' || $entity_type == 'thumb-excerpt' || $entity_type == 'thumb-mag-headline' || $entity_type == 'thumb-tiles') {
		$ret = array('native' => 'Native WP 3.0 featured image', 'custom-thumb' => 'Image specified through custom thumbnail field',
			'attachment' => 'Image attached to the post', 'embedded' => 'Embedded URL in post', 'custom-featured' => 'Image specified through custom Featured Image field');
	}
	else if ($entity_type == 'thumb-featured') {
		$ret = array('custom-featured' => 'Image specified through custom Featured Image field', 'native' => 'Native WP 3.0 featured image', 'custom-thumb' => 'Image specified through custom thumbnail field',
			'attachment' => 'Image attached to the post', 'embedded' => 'Embedded URL in post');
	}
	else if ($entity_type == 'sitemap') {
		global $suffusion_sitemap_entities;
		$ret = array();
		foreach ($suffusion_sitemap_entities as $entity => $entity_options) {
			$ret[$entity] = $entity_options['title'];
		}
	}
    return $ret;
}

function suffusion_get_unified_options() {
	global $suffusion_unified_options, $suffusion_default_theme_name;
	$suffusion_unified_options = get_option('suffusion_options');
	if (!isset($suffusion_unified_options) || !is_array($suffusion_unified_options)) {
		// Regenerate the options
		$suffusion_unified_options = suffusion_default_options();
		$suffusion_unified_options['theme-version'] = SUFFUSION_THEME_VERSION;
		$suffusion_unified_options['option-date'] = date(get_option('date_format').' '.get_option('time_format'));
		$save = true;
	}
	else if (!isset($suffusion_unified_options['theme-version']) ||
			 (isset($suffusion_unified_options['theme-version']) && $suffusion_unified_options['theme-version'] != SUFFUSION_THEME_VERSION) ||
			 !isset($suffusion_unified_options['option-date'])) {
		$default_options = suffusion_default_options();
		$suffusion_unified_options = array_merge($default_options, $suffusion_unified_options);
		$suffusion_unified_options['theme-version'] = SUFFUSION_THEME_VERSION;
		$suffusion_unified_options['option-date'] = date(get_option('date_format').' '.get_option('time_format'));
		$save = true;
	}

	$template_path = get_template_directory();
	$stylesheet_path = get_stylesheet_directory();
	$suffusion_theme_name = suffusion_get_theme_name();
	if ($suffusion_theme_name == 'root') {
		$skin = $suffusion_default_theme_name;
	}
	else {
		$skin = $suffusion_theme_name;
	}

	if (file_exists($stylesheet_path . "/skins/$skin/settings.php")) {
		include_once($stylesheet_path . "/skins/$skin/settings.php");
	}
	else if (file_exists($template_path . "/skins/$skin/settings.php")) {
		include_once($template_path . "/skins/$skin/settings.php");
	}

	if (isset($skin_settings) && is_array($skin_settings)) {
		foreach ($skin_settings as $key => $value) {
			if (!isset($suffusion_unified_options[$key]) || (isset($suffusion_unified_options[$key]) && $suffusion_unified_options[$key] == 'theme')) {
				$suffusion_unified_options[$key] = $skin_settings[$key];
			}
		}
	}

	if (isset($save)) {
		update_option('suffusion_options', $suffusion_unified_options);
	}

	return $suffusion_unified_options;
}

if (!function_exists('suffusion_get_memory_usage')) {
	/**
	 * Returns the total memory usage for the script at any point.
	 *
	 * @param bool $echo Echoes the value if set to true
	 * @return string
	 */
	function suffusion_get_memory_usage($echo = true) {
		$ret = "";
		if (function_exists('memory_get_usage')) {
			$mem = memory_get_usage();
			$unit = "B";
			if ($mem > 1024) {
				$mem = round($mem / 1024);
				$unit = "KB";
				if ($mem > 1024) {
					$mem = round($mem / 1024);
					$unit = "MB";
				}
			}
			$ret = $mem . $unit;
			if ($echo) {
				echo $ret;
			}
		}
		return $ret;
	}
}

/**
 * Returns the name of the skin being used.
 *
 * @return string
 */
function suffusion_get_theme_name() {
    $suffusion_options = get_option('suffusion_options');
    if (!isset($suffusion_options['suf_color_scheme']) || $suffusion_options['suf_color_scheme'] === FALSE || $suffusion_options['suf_color_scheme'] == null || !isset($suffusion_options['suf_color_scheme'])) {
        $theme_name = 'root';
    }
    else {
        $theme_name = $suffusion_options['suf_color_scheme'];
    }
    return $theme_name;
}

function suffusion_get_template_prefixes() {
	$template_prefixes = array('1l-sidebar.php' => '_1l', '1r-sidebar.php' => '_1r', '1l1r-sidebar.php' => '_1l1r', '2l-sidebars.php' => '_2l', '2r-sidebars.php' => '_2r');
	$template_prefixes = apply_filters('suffusion_filter_template_prefixes', $template_prefixes);
	return $template_prefixes;
}

function suffusion_get_template_sidebars() {
	$template_sb = array('1l-sidebar.php' => 1, '1r-sidebar.php' => 1, '1l1r-sidebar.php' => 2, '2l-sidebars.php' => 2, '2r-sidebars.php' => 2);
	$template_sb = apply_filters('suffusion_filter_template_sidebars', $template_sb);
	return $template_sb;
}

function suffusion_new_vars($public_query_vars) {
	$public_query_vars[] = 'suffusion-css';
	return $public_query_vars;
}

/**
 * Core function to generate the custom CSS. This is used by custom-styles.php to print out the stylesheet, if CSS auto-generation
 * is switched off.
 *
 * @param bool $echo
 * @return string
 * @since 3.7.4
 */
function suffusion_generate_all_custom_styles($echo = false) {
	global $suf_enable_responsive;

	$template_path = get_template_directory();
	include_once ($template_path . '/suffusion-css-helper.php');
	include_once ($template_path . '/suffusion-css-generator.php');

	if (isset($suf_enable_responsive) && $suf_enable_responsive == 'on') {
		include_once($template_path.'/responsive-css.php');
	}

	$suffusion_css_generator = new Suffusion_CSS_Generator(date(get_option('date_format').' '.get_option('time_format')));
	$suffusion_custom_css_string = $suffusion_css_generator->generate_all_css();

	if ($echo) {
		echo $suffusion_custom_css_string;
	}

	return $suffusion_custom_css_string;
}

function suffusion_get_interactive_text_fields() {
	global $suffusion_inbuilt_options;
	$field_titles = get_option('suffusion_options_field_titles');
	if (isset($field_titles) && is_array($field_titles)) {
		$theme_version = $field_titles['theme-version'];
	}

	if ((isset($theme_version) && $theme_version != SUFFUSION_THEME_VERSION) || (!isset($theme_version))) {
		$field_titles = array();
		include_once (get_template_directory() . "/admin/theme-options.php");
		foreach ($suffusion_inbuilt_options as $option) {
			if (isset($option['id'])) {
				$field_titles[$option['id']] = isset($option['name']) ? $option['name'] : '';
			}
		}
		$field_titles['theme-version'] = SUFFUSION_THEME_VERSION;
		if (current_user_can('edit_theme_options')) {
			update_option('suffusion_options_field_titles', $field_titles);
		}
	}
	return $field_titles;
}

/**
 * Updates the generated CSS upon saving.
 *
 * @return mixed|string|void
 */
function suffusion_update_generated_css() {
	global $suffusion_unified_options;

	if (!isset($suffusion_unified_options['option-date'])) {
		$suffusion_unified_options = suffusion_get_unified_options();
	}
	foreach ($suffusion_unified_options as $option => $value) {
		global $$option;
		$$option = $value;
	}

	$custom_css = get_option('suffusion_generated_css');

	if (!isset($custom_css) || (isset($custom_css) && !is_array($custom_css)) ||
		(is_array($custom_css) && !isset($custom_css['theme-version'])) ||
		(is_array($custom_css) && isset($custom_css['theme-version']) && $custom_css['theme-version'] != SUFFUSION_THEME_VERSION) ||
		(is_array($custom_css) && !isset($custom_css['option-date'])) ||
		(is_array($custom_css) && isset($custom_css['option-date']) && $custom_css['option-date'] != $suffusion_unified_options['option-date'])) {
			$custom_css = array();
			$custom_css['css'] = suffusion_generate_all_custom_styles();
			$custom_css['option-date'] = $suffusion_unified_options['option-date'];
			$custom_css['theme-version'] = SUFFUSION_THEME_VERSION;
			update_option('suffusion_generated_css', $custom_css);
	}

	return $custom_css;
}

function suffusion_is_sidebar_empty($index) {
	$sidebars = wp_get_sidebars_widgets();
	if ((!isset($sidebars['sidebar-'.$index]) || (isset($sidebars['sidebar-'.$index]) && $sidebars['sidebar-'.$index] == null) || (isset($sidebars['sidebar-'.$index]) && is_array($sidebars['sidebar-'.$index]) && count($sidebars['sidebar-'.$index]) == 0)) &&
			(!isset($sidebars[$index]) || (isset($sidebars[$index]) && $sidebars[$index] == null) || (isset($sidebars[$index]) && is_array($sidebars[$index]) && count($sidebars[$index]) == 0))) {
		return true;
	}
	return false;
}

function suffusion_sidebar_widget_count($index) {
	$sidebars = wp_get_sidebars_widgets();
	if (!isset($sidebars['sidebar-'.$index]) || $sidebars['sidebar-'.$index] == null || (is_array($sidebars['sidebar-'.$index]) && count($sidebars['sidebar-'.$index]) == 0)) {
		return 0;
	}
	else if (is_array($sidebars['sidebar-'.$index])){
		return count($sidebars['sidebar-'.$index]);
	}
	if (!isset($sidebars[$index]) || $sidebars[$index] == null || (is_array($sidebars[$index]) && count($sidebars[$index]) == 0)) {
		return 0;
	}
	else {
		return count($sidebars[$index]);
	}
}

function suffusion_register_jquery() {
	global $suf_featured_use_lite;
	if ($suf_featured_use_lite == 'lite') {
		wp_register_script('suffusion-jquery-cycle', get_template_directory_uri() . '/scripts/jquery.cycle.lite.min.js', array('jquery'), null);
	}
	else {
		wp_register_script('suffusion-jquery-cycle', get_template_directory_uri() . '/scripts/jquery.cycle.all.min.js', array('jquery'), null);
	}
}

/**
 * Registers the Custom Post Types set through the theme. This function predates CPT plugins, but is now being deprecated with version 4.0.0.
 * If this function determines the existence of the "Suffusion Custom Post Types" plugin, it quits and lets the plugin handle things. Otherwise it just
 * registers the post types. It doesn't display the UI in the back-end.
 *
 * @return mixed
 */
function suffusion_register_custom_types() {
	if (class_exists('Suffusion_Custom_Post_Types')) {
		return;
	}

	$suffusion_post_types = get_option('suffusion_post_types');
	$suffusion_taxonomies = get_option('suffusion_taxonomies');
	if (is_array($suffusion_post_types) || is_array($suffusion_taxonomies)) {
		require_once(get_template_directory().'/functions/custom-post-types.php');
	}
}

/**
 * Function to support meus from the Menu dashboard.
 * Strictly speaking this is not required. You could select these same menus from the Main Navigation Bar Setup or Top Navigation Bar Setup.
 *
 * @return void
 */
function suffusion_register_menus() {
	register_nav_menu('top', 'Navigation Bar Above Header');
	register_nav_menu('main', 'Navigation Bar Below Header');
}

function suffusion_add_user_contact_methods($contact_methods) {
    global $suf_uprof_networks, $suffusion_social_networks;
    if (trim($suf_uprof_networks) != '') {
        $networks = explode(',', $suf_uprof_networks);
        foreach ($networks as $network) {
            $display = $suffusion_social_networks[$network];
            $contact_methods[$network] = $display;
        }
    }
    return $contact_methods;
}

/**
 * Support for a custom tag in the style.css header.
 *
 * @param $headers
 * @return array
 */
function suffusion_extra_theme_headers($headers) {
	if (!in_array('Announcements Feed', $headers)) {
		$headers[] = 'Announcements Feed';
	}

	return $headers;
}

function suffusion_pad_signup_form_start() {
?>
<div id="main-col">
<?php
}

function suffusion_pad_signup_form_end() {
?>
</div><!-- #main-col -->
<?php
}

/**
 * Parses all the options, then picks out the default values for them. This is a heavy operation, hence it is executed only while saving.
 *
 * @return array
 */
function suffusion_default_options() {
	global $suffusion_inbuilt_options;
	if (!isset($suffusion_inbuilt_options) || !is_array($suffusion_inbuilt_options)) {
		require_once(get_template_directory().'/admin/theme-options.php');
	}

	$default_options = array();
	foreach ($suffusion_inbuilt_options as $value) {
		if (isset($value['id']) && isset($value['type']) && $value['type'] != 'button' && isset($value['std'])) {
			$default_options[$value['id']] = suffusion_flatten_option($value);
		}
	}
	return $default_options;
}

/**
 * Converts an option's default value to a string. This is useful for options where the default is stored as an array.
 *
 * @param $option
 * @return string
 */
function suffusion_flatten_option($option) {
	if (!is_array($option) || !isset($option['type']) || !isset($option['id']) || !isset($option['std'])) {
		return '';
	}
	switch ($option['type']) {
		case 'sortable-list':
			if (is_array($option['std'])) {
				return implode(',', array_keys($option['std']));
			}
			return $option['std'];

		case 'multi-select':
			if (is_array($option['std'])) {
				return implode(',', $option['std']);
			}
			return $option['std'];

		case 'border':
			if (is_array($option['std'])) {
				$default_txt = "";
				foreach ($option['std'] as $edge => $edge_val) {
					$default_txt .= $edge.'::';
					foreach ($edge_val as $opt => $opt_val) {
						$default_txt .= $opt . "=" . $opt_val . ";";
					}
					$default_txt .= "||";
				}
				return $default_txt;
			}
			return $option['std'];

		case 'background':
			if (is_array($option['std'])) {
				$default_txt = "";
				foreach ($option['std'] as $opt => $opt_val) {
					$default_txt .= $opt."=".$opt_val.";";
				}
				return $default_txt;
			}
			return $option['std'];

		case 'font':
			if (is_array($option['std'])) {
				$default_txt = "";
				foreach ($option['std'] as $opt => $opt_val) {
					$default_txt .= $opt."=".stripslashes($opt_val).";";
				}
				return $default_txt;
			}
			return $option['std'];

		default:
			return $option['std'];
	}
}

/**
 * Returns an indented array of pages, based on parent and child pages. This is used in the admin menus.
 *
 * @return array
 */
function suffusion_get_formatted_page_array() {
	global $suffusion_pages_array;
	if (isset($suffusion_pages_array) && $suffusion_pages_array != null) {
		return $suffusion_pages_array;
	}
	$ret = array();
	$pages = get_pages('sort_column=menu_order');
    if ($pages != null) {
        foreach ($pages as $page) {
            if (is_null($suffusion_pages_array)) {
	            $ret[$page->ID] = array ("title" => $page->post_title, "depth" => count(get_ancestors($page->ID, 'page')));
            }
        }
    }
	if ($suffusion_pages_array == null) {
		$suffusion_pages_array = $ret;
		return $ret;
	}
	else {
		return $suffusion_pages_array;
	}
}

function suffusion_get_formatted_category_array() {
	global $suffusion_categories_array;
	$ret = array();
	$args = array("type" => "post",
		"orderby" => "name",
		"hide_empty" => false,
	);
	$categories = get_categories($args);
	if ($categories == null) { $categories = array(); }
	foreach ($categories as $category) {
		if ($suffusion_categories_array == null) {
			$ret[$category->cat_ID] = array("title" => $category->cat_name);
		}
	}
	if ($suffusion_categories_array == null) {
		$suffusion_categories_array = $ret;
		return $suffusion_categories_array;
	}
	else {
		return $suffusion_categories_array;
	}
}

function suffusion_get_formatted_link_array() {
	global $link_array;
	$ret = array();
	$args = array(
		"order" => "ASC",
		"orderby" => 'name',
	);
	$links = get_bookmarks($args);
	if ($links == null) {
		$links = array();
	}
	foreach ($links as $link) {
		if ($link_array == null) {
			$ret[$link->link_id] = array("title" => $link->link_name);
		}
	}
	if ($link_array == null) {
		$link_array = $ret;
		return $link_array;
	}
	else {
		return $link_array;
	}
}

function suffusion_get_formatted_wp_menu_array() {
	global $suffusion_menu_array;
	$ret = array();

	$menus = wp_get_nav_menus();
	if ($menus == null) {
		$menus = array();
	}

	if ($suffusion_menu_array == null) {
		foreach ($menus as $menu) {
			$ret[$menu->term_id] = array("title" => $menu->name);
		}
		$suffusion_menu_array = $ret;
	}

	return $suffusion_menu_array;
}

function suffusion_get_formatted_options_array($options_array) {
	$ret = array();
    foreach ($options_array as $option_key => $option_value) {
        $ret[$option_key] = array('title' => $option_value, 'depth' => 1);
    }
    return $ret;
}

function suffusion_get_associative_array($stored_value) {
	if (!is_array($stored_value)) {
		$converted = explode('||', $stored_value);
		$stored_value = array();
		foreach ($converted as $converted_string) {
			$converted_pairs = explode('::', $converted_string);
			$index = '';
			$inner_ctr = 0;
			$pair_array = array();
			foreach ($converted_pairs as $pairs_string) {
				$inner_ctr++;
				if ($inner_ctr == 1) {
					$index = $pairs_string;
					continue;
				}
				if (trim($pairs_string) != '') {
					$pairs = explode(';', $pairs_string);
					foreach ($pairs as $pair) {
						$name_value = explode('=', $pair);
						if (count($name_value) <= 1) {
							continue;
						}
						$pair_array[$name_value[0]] = $name_value[1];
					}
				}
			}
			$stored_value[$index] = $pair_array;
		}
	}
	return $stored_value;
}

/**
 * Based on the Image Rotator script by Matt Mullenweg > http://photomatt.net
 * Inspired by Dan Benjamin > http://hiveware.com/imagerotator.php
 * Latest version always at: http://photomatt.net/scripts/randomimage
 *
 * Make the folder the relative path to the images, like "../img" or "random/images/".
 *
 * Modifications by Sayontan Sinha, to dynamically pass the folder for images.
 * This cannot exist as a standalone file, because it loads outside the context of WP, so variables such as folder names cannot be fetched by the file automatically.
 *
 * @param $folder
 * @return string
 */
function suffusion_get_rotating_image($folder) {
	// Space seperated list of extensions, you probably won't have to change this.
	$exts = 'jpg jpeg png gif';

	$files = array(); $i = -1; // Initialize some variables
//	if ('' == $folder) $folder = './';
	$content_folder = trailingslashit(WP_CONTENT_DIR).$folder;

	$handle = opendir($content_folder);
	if ($handle) {
		$exts = explode(' ', $exts);
		while (false !== ($file = readdir($handle))) {
			foreach($exts as $ext) { // for each extension check the extension
				if (preg_match('/\.'.$ext.'$/i', $file, $test)) { // faster than ereg, case insensitive
					$files[] = $file; // it's good
					++$i;
				}
			}
		}
		closedir($handle); // We're not using it anymore
		mt_srand((double)microtime()*1000000); // seed for PHP < 4.2
		$rand = mt_rand(0, $i); // $i was incremented as we went along
		return trailingslashit(WP_CONTENT_URL).trailingslashit($folder).$files[$rand];
	}
	return '';
}


/**
 * Returns an array of public custom post types. The name of the post type is the key and the label name is the value.
 *
 * @param bool $built_in
 * @return array
 */
function suffusion_get_custom_post_types($built_in = false) {
	$ret = array();
	if ($built_in) {
		$post_types = get_post_types(array('public' => true, '_builtin' => true), 'objects');
		foreach ($post_types as $post_type) {
			if ($post_type->name != 'attachment') {
				$ret[$post_type->name] = $post_type->labels->name." (".$post_type->name.")";
			}
		}
	}

	$post_types = get_post_types(array('public' => true, '_builtin' => false), 'objects');
	foreach ($post_types as $post_type) {
		$ret[$post_type->name] = $post_type->labels->name." (".$post_type->name.")";
	}
	return $ret;
}

/**
 * Returns an array of public custom taxonomies. The name of the taxonomy is the key and the label name is the value.
 *
 * @param bool $built_in
 * @return array
 */
function suffusion_get_custom_taxonomies($built_in = false) {
	$ret = array();
	if ($built_in) {
		$taxonomies = get_taxonomies(array('public' => true, '_builtin' => true), 'objects');
		foreach ($taxonomies as $taxonomy) {
			$ret[$taxonomy->name] = $taxonomy->labels->name." (".$taxonomy->name.")";
		}
	}

	$taxonomies = get_taxonomies(array('public' => true, '_builtin' => false), 'objects');
	foreach ($taxonomies as $taxonomy) {
		$ret[$taxonomy->name] = $taxonomy->labels->name." (".$taxonomy->name.")";
	}
	return $ret;
}

/**
 * Adapted from TwentyEleven's function. This prints the styles corresponding to the custom header. If images etc are defined here, they take
 * precedence over Suffusion's definintions.
 *
 * @return mixed
 */
function suffusion_header_style() {
	$text_color = get_header_textcolor();

	// If no custom options for text are set, let's bail.
	if ($text_color == get_theme_support('custom-header', 'default-text-color')) {
		return;
	}

	// If we get this far, we have custom styles. Let's do this.
	?>
<style type="text/css">
	<?php
	$header_image = get_header_image();
	if ($header_image) {
		?>
	#header-container.custom-header {
		background-image: url(<?php echo esc_url($header_image); ?>);
	}
		<?php
	}
	// Has the text been hidden?
	if ('blank' == $text_color) {
		?>
	.custom-header .blogtitle a,
	.custom-header .description {
		position: absolute !important;
		clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
		clip: rect(1px, 1px, 1px, 1px);
	}
		<?php
	}
	else {
		// If the user has set a custom color for the text use that
		?>
	.custom-header .blogtitle a,
	.custom-header .description {
		color: #<?php echo $text_color; ?>;
	}
	<?php
	}
	?>
</style>
<?php
}

/**
 * Adapted from TwentyEleven. This prints the styles on the preview screen.
 */
function suffusion_admin_header_style() {
	?>
<style type="text/css">
.appearance_page_custom-header #headimg {
	border: none;
}
#headimg h1,
#desc {
	font-family: "Helvetica Neue", Arial, Helvetica, "Nimbus Sans L", sans-serif;
}
#headimg h1 {
	margin: 0;
}
#headimg h1 a {
	font-size: 32px;
	line-height: 36px;
	text-decoration: none;
}
#desc {
	font-size: 14px;
	line-height: 23px;
	padding: 0 0 3em;
}
	<?php
	// If the user has set a custom color for the text use that
	if (get_header_textcolor() != get_theme_support('custom-header', 'default-text-color')) {
		?>
#site-title a,
#site-description {
	color: #<?php echo get_header_textcolor(); ?>;
}
	<?php
	}
	?>
#headimg img {
	max-width: 1000px;
	height: auto;
	width: 100%;
}
</style>
<?php
}

/**
 * Prints the preview for the header in the admin screen. This has been adapted from TwentyEleven. Note that this is different from how
 * TwentyEleven works, as TwentyEleven prints the banner <em>below</em> the header text, but Suffusion prints it <em>behind</em>. However,
 * using appropriate combinations of header height, background positioning and background repeating, it is possible to replicate
 * TwentyEleven's look in Suffusion.
 */
function suffusion_admin_header_image() { ?>
<div id="headimg">
	<?php
	$color = get_header_textcolor();
	$image = get_header_image();
	if ($color && $color != 'blank') {
		$style = ' style="color:#' . $color . '"';
	}
	else {
		$style = ' style="display:none"';
	}
	if ($image) {
		$background = ' style="background-image: url('.esc_url($image).'); padding: 15px 0; " ';
	}
	else {
		$background = '';
	}
	?>
	<div <?php echo $background; ?>>
		<h1><a id="name"<?php echo $style; ?> onclick="return false;" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a></h1>
		<div id="desc"<?php echo $style; ?>><?php bloginfo('description'); ?></div>
	</div>
</div>
<?php }

/**
 * The options provided in Suffusion's skinning sections for the header are way more advanced and extensive. So, we make the user
 * aware of more customization options if they are interested.
 */
function suffusion_custom_header_options() {
	_e('For more customization options and better control over the width and height see: ', 'suffusion');
	echo "<ol>";
	_e('<li><em>Appearance &rarr; Suffusion Options &rarr; Theme Skinning &rarr; Header</em></li>', 'suffusion');
	_e('<li><em>Appearance &rarr; Suffusion Options &rarr; Other Graphical Elements &rarr; Header</em></li>', 'suffusion');
	_e('<li><em>Appearance &rarr; Suffusion Options &rarr; Layouts &rarr; Default Sidebar Layout</em></li>', 'suffusion');
	echo "</ol>";
}

function suffusion_customize_register($wp_customize) {
	$template_path = get_template_directory();
	$template_uri = get_template_directory_uri();
	require_once ($template_path.'/library/customizers.php');

	$wp_customize->add_section('suffusion_color_scheme', array(
		'title' => __('Skin', 'suffusion' ),
	));

	$wp_customize->add_setting(
		'suffusion_options[suf_color_scheme]',
		array(
			'default' => 'light-theme-gray-1',
			'type' => 'option',
			'capability' => 'edit_theme_options',
			'transport' => 'postMessage',
		)
	);

	$wp_customize->add_control(new Suffusion_Customize_Image_Picker($wp_customize,
		'suffusion_color_scheme',
		array(
			'label' => __( 'Skin', 'suffusion' ),
			'section' => 'suffusion_color_scheme',
			'settings' => 'suffusion_options[suf_color_scheme]',
			'choices' => array(
				"scribbles" => array('src' => $template_uri.'/screenshot-1.png', 'alt' => 'Scribbles', 'style' => 'width: 150px;'),
				"photonique" => array('src' => $template_uri.'/screenshot-2.png', 'alt' => 'Photonique', 'style' => 'width: 150px;'),
				"minima" => array('src' => $template_uri.'/admin/images/minima.jpg', 'alt' => 'Minima', 'style' => 'width: 150px;'),
				"light-theme-green" => array('src' => $template_uri.'/admin/images/Light-theme-green.jpg', 'alt' => 'Green on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-green" => array('src' => $template_uri.'/admin/images/Dark-theme-green.jpg', 'alt' => 'Green on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-pale-blue" => array('src' => $template_uri.'/admin/images/Light-theme-pale-blue.jpg', 'alt' => 'Pale Blue on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-pale-blue" => array('src' => $template_uri.'/admin/images/Dark-theme-pale-blue.jpg', 'alt' => 'Pale Blue on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-royal-blue" => array('src' => $template_uri.'/admin/images/Light-theme-royal-blue.jpg', 'alt' => 'Royal Blue on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-royal-blue" => array('src' => $template_uri.'/admin/images/Dark-theme-royal-blue.jpg', 'alt' => 'Royal Blue on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-gray-1" => array('src' => $template_uri.'/screenshot.png', 'alt' => 'Gray Shade 1 on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-gray-1" => array('src' => $template_uri.'/admin/images/Dark-theme-gray-1.jpg', 'alt' => 'Gray Shade 1 on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-gray-2" => array('src' => $template_uri.'/admin/images/Light-theme-gray-2.jpg', 'alt' => 'Gray Shade 2 on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-gray-2" => array('src' => $template_uri.'/admin/images/Dark-theme-gray-2.jpg', 'alt' => 'Gray Shade 2 on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-red" => array('src' => $template_uri.'/admin/images/Light-theme-red.jpg', 'alt' => 'Red on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-red" => array('src' => $template_uri.'/admin/images/Dark-theme-red.jpg', 'alt' => 'Red on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-orange" => array('src' => $template_uri.'/admin/images/Light-theme-orange.jpg', 'alt' => 'Orange on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-orange" => array('src' => $template_uri.'/admin/images/Dark-theme-orange.jpg', 'alt' => 'Orange on a dark theme', 'style' => 'width: 150px;'),
				"light-theme-purple" => array('src' => $template_uri.'/admin/images/Light-theme-purple.jpg', 'alt' => 'Purple on a light theme', 'style' => 'width: 150px;'),
				"dark-theme-purple" => array('src' => $template_uri.'/admin/images/Dark-theme-purple.jpg', 'alt' => 'Purple on a dark theme', 'style' => 'width: 150px;'),
			),
			'footer_message' => 'Please see <em>Appearance &rarr; Suffusion Options</em> for more options',
		)
	));

	if ($wp_customize->is_preview() && !is_admin())
		add_action('wp_footer', 'suffusion_customize_preview', 21);
}

function suffusion_customize_preview() {
	global $suffusion_theme_hierarchy;
	?>
<script type="text/javascript">
	wp.customize('suffusion_options[suf_color_scheme]', function(value) {
		value.bind(function(to) {
			var skins = <?php echo json_encode($suffusion_theme_hierarchy); ?>;
			console.log(skins);
			var fonts = {
				'photonique': 'http://fonts.googleapis.com/css?family=Quattrocento',
				'scribbles': 'http://fonts.googleapis.com/css?family=Coming+Soon'
			};
			if (typeof skins[to] != 'undefined' && skins[to].length > 1) {
				var links = jQuery('link');
				var len = links.length;
				var skinIndex = 0;
				for (var i = 0; i < len; i++) {
					if (links[i].id != '' && links[i].id.length > 23 && links[i].id.substr(0, 23) == 'suffusion-theme-skin-1-') {
						skinIndex = i;
					}
				}

				var linked_skins = jQuery(links).filter(function() {
					return this.id.match(/suffusion-theme-skin-[0-9]+-css/);
				});
				linked_skins.remove();
				jQuery('#suffusion-skin-fonts-css').remove();

				var replacements = new Array();
				for (var j = 1; j < skins[to].length; j++) {
					replacements[j-1] = "<link rel='stylesheet' id='suffusion-theme-skin-" + j + "-css' href='<?php echo trailingslashit(get_template_directory_uri()); ?>" + skins[to][j] + "' type='text/css' media='all' />";
				}
				if (typeof fonts[to] != 'undefined') {
					replacements[replacements.length] = "<link rel='stylesheet' id='suffusion-skin-fonts-css' href='" + fonts[to] + "' type='text/css' media='all' />";
				}

				links = jQuery('link');
				if (links.length <= skinIndex) {
					// add links to the end
					for (var k = 0; k < replacements.length; k++) {
						jQuery('head').append(replacements[k]);
					}
				}
				else {
					var before = links[skinIndex].id;
					for (var k = 0; k < replacements.length; k++) {
						jQuery('#' + before).before(replacements[k]);
					}
				}
			}
		});
	});
</script>
<?php
}

function suffusion_get_horizontal_components($include = array(), $exclude = array()) {
	$base = array(
		'widgets-above-header' => 'Widgets Above Header',
		'header-widgets' => 'Widgets in Header',
		'horizontal-outer-widgets-1' => 'Widget Area Below Header',
		'horizontal-outer-widgets-2' => 'Widget Area Above Footer',
		'ad-hoc-1' => 'Ad Hoc Widget Area 1',
		'ad-hoc-2' => 'Ad Hoc Widget Area 2',
		'ad-hoc-3' => 'Ad Hoc Widget Area 3',
		'ad-hoc-4' => 'Ad Hoc Widget Area 4',
		'ad-hoc-5' => 'Ad Hoc Widget Area 5',
		'cl-warea-id-1' => 'Custom Layout Template Widget Area 1',
		'cl-warea-id-2' => 'Custom Layout Template Widget Area 2',
		'cl-warea-id-3' => 'Custom Layout Template Widget Area 3',
		'cl-warea-id-4' => 'Custom Layout Template Widget Area 4',
		'cl-warea-id-5' => 'Custom Layout Template Widget Area 5',
		'suf-mag-excerpts' => 'Magazine Layout Excerpts',
		'suf-mag-categories' => 'Magazine Layout Category Blocks',
		'suf-tiles' => 'Tile Layout',
		'mega-menus' => 'Mega Menus',
	);
	foreach ($include as $element => $label) {
		if (!isset($base[$element])) {
			$base[$element] = $label;
		}
	}
	foreach ($exclude as $element => $label) {
		if (isset($base[$element])) {
			unset($base[$element]);
		}
	}
	return $base;
}