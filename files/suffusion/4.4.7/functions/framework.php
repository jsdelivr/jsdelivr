<?php
/**
 * Core framework file, which controls the loading of most of the other sections.
 *
 * @package Suffusion
 * @subpackage Functions
 * @since 4.0.0
 */
class Suffusion_Framework {
	function __construct() {
		add_action('after_setup_theme', array(&$this, 'globals'), 1);
		add_action('after_setup_theme', array(&$this, 'template'), 5);
		add_action('wp_head', array(&$this, 'specific'), 6);
		add_action('wp_loaded', array(&$this, 'admin'));
	}

	/**
	 * Initializes all global variables required by Suffusion. This is the first call executed because the variables are used by
	 * all other functions.
	 *
	 * @return void
	 */
	function globals() {
		global $content_width, $suffusion_locale, $suffusion_safe_font_faces, $suffusion_options, $suffusion_theme_name, $suffusion_theme_hierarchy;
		global $suffusion_default_theme_name, $suffusion_pages_array, $suffusion_categories_array, $suffusion_comment_types, $suffusion_sidebar_tabs;
		global $suffusion_404_title, $suffusion_404_content, $suffusion_comment_label_name, $suffusion_comment_label_req, $suffusion_comment_label_email;
		global $suffusion_comment_label_uri, $suffusion_comment_label_your_comment, $suffusion_social_networks, $suffusion_sidebar_context_presets;
		global $suffusion_options_intro_page, $suffusion_options_theme_skinning_page, $suffusion_options_visual_effects_page, $suffusion_options_sidebars_and_widgets_page, $suffusion_options_blog_features_page, $suffusion_options_templates_page, $suffusion_options_custom_types_page;
		global $suffusion_sitemap_entities, $suffusion_all_sitemap_entities, $suffusion_options_layouts_page, $suffusion_options_typography_page;
		global $suffusion_is_ie6, $suffusion_skin_dependence, $suffusion_mm_sidebar_count;

		$suffusion_locale = get_locale();
		load_textdomain('suffusion', locate_template(array("translation/{$suffusion_locale}.mo", "{$suffusion_locale}.mo")));
		do_action('suffusion_load_additional_text_domains');

		if (!isset($content_width)) $content_width = 695; // 725 - 30px padding

		$suffusion_safe_font_faces = array (
			"Arial, Helvetica, sans-serif" => "<span>Arial, <span class='mac'>Arial, Helvetica,</span> <i>sans-serif</i></span>",
			"'Arial Black', Gadget, sans-serif" => "<span>Arial Black, <span class='mac'>Arial Black, Gadget,</span> <i>sans-serif</i></span>",
			"'Comic Sans MS', cursive" => "<span>Comic Sans MS, <span class='mac'>Comic Sans MS,</span> <i>cursive</i></span>",
			"'Courier New', Courier, monospace " => "<span>Courier New, <span class='mac'>Courier New, Courier,</span> <i>monospace</i></span>",
			"Georgia, serif" => "<span>Georgia, <span class='mac'>Georgia,</span> <i>serif</i></span>",
			"Impact, Charcoal, sans-serif" => "<span>Impact, <span class='mac'>Impact, Charcoal,</span> <i>sans-serif</i></span>",
			"'Lucida Console', Monaco, monospace" => "<span>Lucida Console, <span class='mac'>Monaco,</span> <i>monospace</i></span>",
			"'Lucida Sans Unicode', 'Lucida Grande', sans-serif" => "<span>Lucida Sans Unicode, <span class='mac'>Lucida Grande,</span> <i>sans-serif</i></span>",
			"'Palatino Linotype', 'Book Antiqua', Palatino, serif" => "<span>Palatino Linotype, Book Antiqua, <span class='mac'>Palatino,</span> <i>serif</i></span>",
			"Tahoma, Geneva, sans-serif" => "<span>Tahoma, <span class='mac'>Geneva,</span> <i>sans-serif</i></span>",
			"'Times New Roman', Times, serif" => "<span>Times New Roman, <span class='mac'>Times,</span> <i>serif</i></span>",
			"'Trebuchet MS', Helvetica, sans-serif" => "<span>Trebuchet MS, <span class='mac'>Helvetica,</span> <i>sans-serif</i></span>",
			"Verdana, Geneva, sans-serif" => "<span>Verdana, <span class='mac'>Verdana, Geneva,</span> <i>sans-serif</i></span>",
			"Symbol" => "<span>Symbol, <span class='mac'>Symbol</span></span> (\"Symbol\" works in IE and Chrome on Windows and in Safari on Mac)",
			"Webdings" => "<span>Webdings, <span class='mac'>Webdings</span></span> (\"Webdings\" works in IE and Chrome on Windows and in Safari on Mac)",
			"Wingdings, 'Zapf Dingbats'" => "<span>Wingdings, <span class='mac'>Zapf Dingbats</span></span> (\"Wingdings\" works in IE and Chrome on Windows and in Safari on Mac)",
			"'MS Sans Serif', Geneva, sans-serif" => "<span>MS Sans Serif, <span class='mac'>Geneva,</span> <i>sans-serif</i></span>",
			"'MS Serif', 'New York', serif" => "<span>MS Serif, <span class='mac'>New York,</span> <i>serif</i></span>",
		);
		include(get_template_directory().'/functions/fonts.php');
		$fonts = new Suffusion_Fonts();
		$suffusion_safe_font_faces = apply_filters('suffusion_font_list', $suffusion_safe_font_faces);

		$suffusion_options = get_option('suffusion_options');
		$suffusion_theme_name = suffusion_get_theme_name();
		$suffusion_default_theme_name = "light-theme-gray-1";

		$suffusion_pages_array = null;
		$suffusion_categories_array = null;

		$suffusion_comment_types = array('comment' => __('Comments', 'suffusion'), 'trackback' => __('Trackbacks', 'suffusion'), 'pingback' => __('Pingbacks', 'suffusion'));

		$suffusion_sidebar_tabs = array(
			'archives' => array('title' => __('Archives', 'suffusion')),
			'categories' => array('title' => __('Categories', 'suffusion')),
			'Links' => array('title' => __('Links', 'suffusion')),
			'meta' => array('title' => __('Meta', 'suffusion')),
			'pages' => array('title' => __('Pages', 'suffusion')),
			'recent_comments' => array('title' => __('Recent Comments', 'suffusion')),
			'recent_posts' => array('title' => __('Recent Posts', 'suffusion')),
			'search' => array('title' => __('Search', 'suffusion')),
			'tag_cloud' => array('title' => __('Tag Cloud', 'suffusion')),
			'custom_tab_1' => array('title' => __('Custom Tab 1', 'suffusion')),
			'custom_tab_2' => array('title' => __('Custom Tab 2', 'suffusion')),
			'custom_tab_3' => array('title' => __('Custom Tab 3', 'suffusion')),
			'custom_tab_4' => array('title' => __('Custom Tab 4', 'suffusion')),
			'custom_tab_5' => array('title' => __('Custom Tab 5', 'suffusion')),
			'custom_tab_6' => array('title' => __('Custom Tab 6', 'suffusion')),
			'custom_tab_7' => array('title' => __('Custom Tab 7', 'suffusion')),
			'custom_tab_8' => array('title' => __('Custom Tab 8', 'suffusion')),
			'custom_tab_9' => array('title' => __('Custom Tab 9', 'suffusion')),
			'custom_tab_10' => array('title' => __('Custom Tab 10', 'suffusion')),
		);

		$suffusion_404_title =  __("Error 404 - Not Found", "suffusion");
		$suffusion_404_content = __("Sorry, the page that you are looking for does not exist.", "suffusion");

		$suffusion_comment_label_name = __('Name', "suffusion");
		$suffusion_comment_label_req = __('(required)', "suffusion");
		$suffusion_comment_label_email = __('E-mail', "suffusion");
		$suffusion_comment_label_uri = __('URI', "suffusion");
		$suffusion_comment_label_your_comment = __('Your Comment', "suffusion");

		$suffusion_sidebar_context_presets = array('search', 'date', 'author', 'tag', 'category', 'blog');

		$suffusion_social_networks = array('twitter' => 'Twitter',
			'google' => 'Google',
			'facebook' => 'Facebook',
			'technorati' => 'Technorati',
			'linkedin' => "LinkedIn",
			'flickr' => 'Flickr',
			'delicious' => 'Delicious',
			'digg' => 'Digg',
			'stumbleupon' => 'StumbleUpon',
			'reddit' => "Reddit");

		$suffusion_sitemap_entities = array(
			'pages' => array('title' => 'Pages', 'opt' => '_pages'),
			'categories' => array('title' => 'Categories', 'opt' => '_categories'),
			'authors' => array('title' => 'Authors', 'opt' => '_authors'),
			'years' => array('title' => 'Yearly Archives', 'opt' => '_yarchives'),
			'months' => array('title' => 'Monthly Archives', 'opt' => '_marchives'),
			'weeks' => array('title' => 'Weekly Archives', 'opt' => '_warchives'),
			'days' => array('title' => 'Daily Archives', 'opt' => '_darchives'),
			'tag-cloud' => array('title' => 'Tags', 'opt' => '_tags'),
			'posts' => array('title' => 'Blog Posts', 'opt' => '_posts'),
		);

		$suffusion_all_sitemap_entities = array_keys($suffusion_sitemap_entities);
		$suffusion_all_sitemap_entities = implode(',', $suffusion_all_sitemap_entities);

		$suffusion_theme_hierarchy = array(
			'light-theme-gray-1' => array('style.css', 'skins/light-theme-gray-1/skin.css'),
			'light-theme-gray-2' => array('style.css', 'skins/light-theme-gray-2/skin.css'),
			'light-theme-green' => array('style.css', 'skins/light-theme-green/skin.css'),
			'light-theme-orange' => array('style.css', 'skins/light-theme-orange/skin.css'),
			'light-theme-pale-blue' => array('style.css', 'skins/light-theme-pale-blue/skin.css'),
			'light-theme-purple' => array('style.css', 'skins/light-theme-purple/skin.css'),
			'light-theme-red' => array('style.css', 'skins/light-theme-red/skin.css'),
			'light-theme-royal-blue' => array('style.css', 'skins/light-theme-royal-blue/skin.css'),
			'dark-theme-gray-1' => array('style.css', 'skins/light-theme-gray-1/skin.css', 'dark-style.css', 'skins/dark-theme-gray-1/skin.css'),
			'dark-theme-gray-2' => array('style.css', 'skins/light-theme-gray-2/skin.css', 'dark-style.css', 'skins/dark-theme-gray-2/skin.css'),
			'dark-theme-green' => array('style.css', 'skins/light-theme-green/skin.css', 'dark-style.css', 'skins/dark-theme-green/skin.css'),
			'dark-theme-orange' => array('style.css', 'skins/light-theme-orange/skin.css', 'dark-style.css', 'skins/dark-theme-orange/skin.css'),
			'dark-theme-pale-blue' => array('style.css', 'skins/light-theme-pale-blue/skin.css', 'dark-style.css', 'skins/dark-theme-pale-blue/skin.css'),
			'dark-theme-purple' => array('style.css', 'skins/light-theme-purple/skin.css', 'dark-style.css', 'skins/dark-theme-purple/skin.css'),
			'dark-theme-red' => array('style.css', 'skins/light-theme-red/skin.css', 'dark-style.css', 'skins/dark-theme-red/skin.css'),
			'dark-theme-royal-blue' => array('style.css', 'skins/light-theme-royal-blue/skin.css', 'dark-style.css', 'skins/dark-theme-royal-blue/skin.css'),
			'minima' => array('style.css', 'skins/minima/skin.css'),
			'scribbles' => array('style.css', 'skins/scribbles/skin.css'),
			'photonique' => array('style.css', 'skins/photonique/skin.css'),
		);

		$suffusion_skin_dependence = array(
			'light-theme-gray-1' => array(),
			'light-theme-gray-2' => array(),
			'light-theme-green' => array(),
			'light-theme-orange' => array(),
			'light-theme-pale-blue' => array(),
			'light-theme-purple' => array(),
			'light-theme-red' => array(),
			'light-theme-royal-blue' => array(),
			'dark-theme-gray-1' => array('light-theme-gray-1', 'dark-style'),
			'dark-theme-gray-2' => array('light-theme-gray-2', 'dark-style'),
			'dark-theme-green' => array('light-theme-green', 'dark-style'),
			'dark-theme-orange' => array('light-theme-orange', 'dark-style'),
			'dark-theme-pale-blue' => array('light-theme-pale-blue', 'dark-style'),
			'dark-theme-purple' => array('light-theme-purple', 'dark-style'),
			'dark-theme-red' => array('light-theme-red', 'dark-style'),
			'dark-theme-royal-blue' => array('light-theme-royal-blue', 'dark-style'),
			'minima' => array(),
			'wood-leather' => array(),
		);

		$suffusion_options_intro_page = 'theme-options-intro.php';
		$suffusion_options_theme_skinning_page = 'theme-options-theme-skinning.php';
		$suffusion_options_visual_effects_page = 'theme-options-visual-effects.php';
		$suffusion_options_sidebars_and_widgets_page = 'theme-options-sidebars-and-widgets.php';
		$suffusion_options_blog_features_page = 'theme-options-blog-features.php';
		$suffusion_options_templates_page = 'theme-options-templates.php';
		$suffusion_options_layouts_page = 'theme-options-layouts.php';
		$suffusion_options_typography_page = 'theme-options-typography.php';
		$suffusion_options_custom_types_page = 'theme-options-custom-types.php';

		//WP provides a global $is_IE, but we specifically need to find IE6x (or, heaven forbid, IE5x). Note that older versions of Opera used to identify themselves as IE6, so we exclude Opera.
		$suffusion_is_ie6 = preg_match('/\bmsie [56]/i', $_SERVER['HTTP_USER_AGENT']) && !preg_match('/\bopera/i', $_SERVER['HTTP_USER_AGENT']);

		$suffusion_mm_sidebar_count = apply_filters('suffusion_mega_menu_count', 10);
	}

	/**
	 * Loads files required by admin screens
	 */
	function admin() {
		if (is_admin()) { // The following don't need to be loaded for non-admin screens
			$template_path = get_template_directory();

			require_once ($template_path . "/functions/admin.php");
			require_once ($template_path . "/admin/suffusion-options-page.php");
			require_once ($template_path.'/admin/theme-options-renderer.php');

			require_if_theme_supports('mega-menus', $template_path.'/library/suffusion-admin-walkers.php');
		}
	}

	/**
	 * Loads files required by non-admin screens
	 */
	function template() {
		if (!is_admin()) {
			$template_path = get_template_directory();
			require_once ($template_path . "/functions/template.php");
			require_once ($template_path . "/functions/actions.php");
			require_once ($template_path . "/functions/filters.php");
			require_once ($template_path . "/functions/media.php");
			if (!class_exists('Suffusion_Shortcodes')) {
				require_once ($template_path . "/functions/shortcodes.php");
			}
			require_once ($template_path . "/library/device.php");
			suffusion_query_post_meta();
		}
	}

	/**
	 * Loads files required by specific templates or screens on the front-end
	 */
	function specific() {
		$template_path = get_template_directory();
		if (is_page_template('magazine.php')) {
			require_once ($template_path . "/functions/magazine-functions.php");
		}
		require_if_theme_supports('mega-menus', $template_path.'/library/suffusion-walkers.php');
	}
}
