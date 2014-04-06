<?php
/**
 * Contains the layout functions for Suffusion's options.
 * This file is included in functions.php
 *
 * @package Suffusion
 * @subpackage Admin
 */

global $suffusion_options_file, $suffusion_options, $suffusion_options_intro_page, $suffusion_options_theme_skinning_page, $suffusion_options_visual_effects_page, $suffusion_options_sidebars_and_widgets_page, $suffusion_options_blog_features_page, $suffusion_options_templates_page, $wp_version;
$suffusion_options_file = basename(__FILE__);

/**
 * Create the HTML markup for the options.
 *
 * @return void
 */
function suffusion_render_options() {
	global $suffusion_options_intro_page, $suffusion_options_theme_skinning_page, $suffusion_options_typography_page, $suffusion_options_visual_effects_page, $suffusion_options_sidebars_and_widgets_page, $suffusion_options_blog_features_page, $suffusion_options_templates_page, $suffusion_options_custom_types_page, $suffusion_options_layouts_page;
	global $suffusion_intro_options, $suffusion_theme_skinning_options, $suffusion_typography_options, $suffusion_visual_effects_options, $suffusion_sidebars_and_widgets_options, $suffusion_blog_features_options, $suffusion_templates_options, $suffusion_custom_types_options, $suffusion_layouts_options;
	$suffusion_template_path = get_template_directory();

	$option_page_options = $suffusion_intro_options;
	$options_page = 'theme-options-intro.php';
	if (isset($_REQUEST['tab'])) {
		$options_page = $_REQUEST['tab'];
		if ($options_page == $suffusion_options_theme_skinning_page) {
			include_once($suffusion_template_path . "/admin/theme-options-theme-skinning.php");
			$option_page_options = $suffusion_theme_skinning_options;
		}
		else if ($options_page == $suffusion_options_layouts_page) {
			include_once($suffusion_template_path . "/admin/theme-options-layouts.php");
			$option_page_options = $suffusion_layouts_options;
		}
		else if ($options_page == $suffusion_options_typography_page) {
			include_once($suffusion_template_path . "/admin/theme-options-typography.php");
			$option_page_options = $suffusion_typography_options;
		}
		else if ($options_page == $suffusion_options_visual_effects_page) {
			include_once($suffusion_template_path . "/admin/theme-options-visual-effects.php");
			$option_page_options = $suffusion_visual_effects_options;
		}
		else if ($options_page == $suffusion_options_blog_features_page) {
			include_once($suffusion_template_path . "/admin/theme-options-blog-features.php");
			$option_page_options = $suffusion_blog_features_options;
		}
		else if ($options_page == $suffusion_options_sidebars_and_widgets_page) {
			include_once($suffusion_template_path . "/admin/theme-options-sidebars-and-widgets.php");
			$option_page_options = $suffusion_sidebars_and_widgets_options;
		}
		else if ($options_page == $suffusion_options_templates_page) {
			include_once($suffusion_template_path . "/admin/theme-options-templates.php");
			$option_page_options = $suffusion_templates_options;
		}
		else if ($options_page == $suffusion_options_custom_types_page) {
			include_once($suffusion_template_path . "/admin/theme-options-custom-types.php");
			$option_page_options = $suffusion_custom_types_options;
		}
		else {
			include_once($suffusion_template_path . "/admin/theme-options-intro.php");
			$option_page_options = $suffusion_intro_options;
		}
	}

	$generated_css = get_option('suffusion_generated_css');
	//$db_options = get_option('suffusion_options');
	global $suffusion_unified_options;
	if (isset($suffusion_unified_options) && is_array($suffusion_unified_options) &&
			isset($suffusion_unified_options['suf_autogen_css']) && $suffusion_unified_options['suf_autogen_css'] == 'autogen-file') {
		if (isset($generated_css) && is_array($generated_css)) {
			if (suffusion_save_css_to_file($generated_css)) {
				return;
			}
		}
	}
	suffusion_get_custom_post_types();
?>
	<div class="wrapper">
		<div class="suf-tabbed-options">
<?php
	echo suffusion_translation_checker();
	echo suffusion_bp_checker();
	if ((isset($_GET['updated']) && $_GET['updated'] == true) || (isset($_GET['settings-updated']) && $_GET['settings-updated'] == true)) {
		echo "<div class='updated fade fix'>Your settings have been updated.</div>";
	}

	if (isset($_GET['now-active']) && $_GET['now-active'] == true) {
		echo "<div class='updated fade fix'>Congratulations! Suffusion has been activated.</div>";
	}
		?>
			<div class="suf-header-nav">
				<div class="suf-header-nav-top fix">
					<h2 class='suf-header-1'>Suffusion &ndash; <?php echo SUFFUSION_THEME_VERSION; ?></h2>
					<div class='donate fix'>
						<form action="https://www.paypal.com/cgi-bin/webscr" method="post" id="paypal-submit" >
							<input type="hidden" name="cmd" value="_s-xclick"/>
							<input type="hidden" name="hosted_button_id" value="9018267"/>
							<ul>
								<li class='announcements'><a href='http://www.aquoid.com/news'>Announcements</a></li>
								<li class='support'><a href='http://www.aquoid.com/forum'>Support Forum</a></li>
								<li class='showcase'><a href='http://www.aquoid.com/news/showcase/'>Showcase</a></li>
								<li class='coffee'><input type='submit' name='submit' value='Like Suffusion? Buy me a coffee!' /></li>
							</ul>
							<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
						</form>
					</div><!-- donate -->
				</div>
				<div class="suf-options-header-bar fix">
					<ul class='suf-options-header-bar'>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_intro_page) echo 'current-tab'; ?>' id='theme-options-intro' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_intro_page; ?>'>Introduction</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_theme_skinning_page) echo 'current-tab'; ?>' id='theme-options-theme-skinning' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_theme_skinning_page; ?>'>Skinning</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_layouts_page) echo 'current-tab'; ?>' id='theme-options-layouts' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_layouts_page; ?>'>Layouts</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_typography_page) echo 'current-tab'; ?>' id='theme-options-typography' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_typography_page; ?>'>Typography</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_sidebars_and_widgets_page) echo 'current-tab'; ?>' id='theme-options-sidebars-and-widgets' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_sidebars_and_widgets_page; ?>'>Sidebars</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_visual_effects_page) echo 'current-tab'; ?>' id='theme-options-visual-effects' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_visual_effects_page; ?>'>Other Graphical Elements</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_blog_features_page) echo 'current-tab'; ?>' id='theme-options-blog-features' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_blog_features_page; ?>'>Back-end</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_templates_page) echo 'current-tab'; ?>' id='theme-options-templates' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_templates_page; ?>'>Templates</a></li>
						<li><a class='suf-load-page <?php if ($options_page == $suffusion_options_custom_types_page) echo 'current-tab'; ?>' id='theme-options-custom-types' href='?page=suffusion-options-manager&amp;tab=<?php echo $suffusion_options_custom_types_page; ?>'>Custom Types</a></li>
					</ul>
				</div>
			</div>
<?php
	$renderer = new Suffusion_Options_Renderer($option_page_options, __FILE__);
	$option_structure = $renderer->get_option_structure();
	$renderer->get_options_html($option_structure);
	?>
		</div><!-- suf-tabbed-options -->
	</div><!-- wrapper -->
<?php
	echo "<!-- ".get_num_queries()." queries, ".suffusion_get_memory_usage(false)." in ".timer_stop()."s -->\n";
}

/**
 * Save generated options to a file. This uses the WP_Filesystem to validate the credentials of the user attempting to save options.
 *
 * @param array $custom_css
 * @return bool
 */
function suffusion_save_css_to_file($custom_css = array()) {
	if(!isset($_GET['settings-updated'])) {
		return false;
	}

	$url = wp_nonce_url('themes.php?page=suffusion-options-manager');
	if (false === ($creds = request_filesystem_credentials($url, '', false, false))) {
		return true;
	}

	if (!WP_Filesystem($creds)) {
		request_filesystem_credentials($url, '', true, false);
		return true;
	}

	global $wp_filesystem;
	$upload_dir = wp_upload_dir();
	$dirname = trailingslashit($upload_dir['basedir']).'suffusion';
	if (!is_dir($dirname)) {
		if (!$wp_filesystem->mkdir($dirname)) {
			echo "<div class='error'><p>Failed to create directory $dirname. Please check your folder permissions.</p></div>";
		}
	}

	$filename = trailingslashit($dirname).'custom-styles.css';
	if (!is_array($custom_css)) {
		$custom_css = get_option('suffusion_generated_css');
	}

	if (is_array($custom_css) && isset($custom_css['css'])) {
		if (!$wp_filesystem->put_contents($filename, $custom_css['css'], FS_CHMOD_FILE)) {
			echo "<div class='error'><p>Failed to save file $filename. Please check your folder permissions.</p></div>";
		}
	}
}

/**
 * Set up the renderer and initialize the settings.
 *
 * @return void
 */
function suffusion_options_init_fn() {
	global $suffusion_options_renderer;

	if (!isset($suffusion_options_renderer)) {
		$option_page_options = suffusion_get_options_for_page();
		$suffusion_options_renderer = new Suffusion_Options_Renderer($option_page_options, __FILE__);
	}
	$option_structure = $suffusion_options_renderer->get_option_structure();
	$suffusion_options_renderer->initialize_settings($option_structure);
}

/**
 * Returns the options for a specific theme options page.
 *
 * @return array
 */
function suffusion_get_options_for_page() {
	global $suffusion_options_intro_page, $suffusion_options_theme_skinning_page, $suffusion_options_typography_page, $suffusion_options_visual_effects_page, $suffusion_options_sidebars_and_widgets_page, $suffusion_options_blog_features_page, $suffusion_options_templates_page, $suffusion_options_custom_types_page, $suffusion_options_layouts_page;
	global $suffusion_intro_options, $suffusion_theme_skinning_options, $suffusion_typography_options, $suffusion_visual_effects_options, $suffusion_sidebars_and_widgets_options, $suffusion_blog_features_options, $suffusion_templates_options, $suffusion_custom_types_options, $suffusion_layouts_options;

	$options_page = $suffusion_options_intro_page;
	if (isset($_REQUEST['tab'])) {
		$options_page = $_REQUEST['tab'];
	}

	$suffusion_template_path = get_template_directory();
	if ($options_page == $suffusion_options_theme_skinning_page) {
		include_once($suffusion_template_path . "/admin/theme-options-theme-skinning.php");
		$option_page_options = $suffusion_theme_skinning_options;
	}
	else if ($options_page == $suffusion_options_layouts_page) {
		include_once($suffusion_template_path . "/admin/theme-options-layouts.php");
		$option_page_options = $suffusion_layouts_options;
	}
	else if ($options_page == $suffusion_options_typography_page) {
		include_once($suffusion_template_path . "/admin/theme-options-typography.php");
		$option_page_options = $suffusion_typography_options;
	}
	else if ($options_page == $suffusion_options_visual_effects_page) {
		include_once($suffusion_template_path . "/admin/theme-options-visual-effects.php");
		$option_page_options = $suffusion_visual_effects_options;
	}
	else if ($options_page == $suffusion_options_blog_features_page) {
		include_once($suffusion_template_path . "/admin/theme-options-blog-features.php");
		$option_page_options = $suffusion_blog_features_options;
	}
	else if ($options_page == $suffusion_options_sidebars_and_widgets_page) {
		include_once($suffusion_template_path . "/admin/theme-options-sidebars-and-widgets.php");
		$option_page_options = $suffusion_sidebars_and_widgets_options;
	}
	else if ($options_page == $suffusion_options_templates_page) {
		include_once($suffusion_template_path . "/admin/theme-options-templates.php");
		$option_page_options = $suffusion_templates_options;
	}
	else if ($options_page == $suffusion_options_custom_types_page) {
		include_once($suffusion_template_path . "/admin/theme-options-custom-types.php");
		$option_page_options = $suffusion_custom_types_options;
	}
	else {
		include_once($suffusion_template_path . "/admin/theme-options-intro.php");
		$option_page_options = $suffusion_intro_options;
	}

	return $option_page_options;
}

/**
 * Prints the help screens at the top
 * @return void
 */
function suffusion_admin_help_pages() {
	if (isset($_REQUEST['page']) && 'suffusion-options-manager' == $_REQUEST['page']) {
		include_once (get_template_directory().'/admin/admin-help.php');
		global $suffusion_help_texts;
		$screen = get_current_screen();
		// The "add_help_tab" method was only introduced in 3.3, so checking...
		if (method_exists($screen, 'add_help_tab')) {
			foreach ($suffusion_help_texts as $help) {
				$screen->add_help_tab(array('id' => $help['category'], 'title' => $help['name'], 'content' =>  "<h3>{$help['name']}</h3>".$help['help']));
			}
		}
	}
}

/**
 * Loads JavaScript relevant only to Suffusion's admin panels.
 *
 * @return void
 */
function suffusion_admin_script_loader() {
	global $wp_version;
	wp_enqueue_script('jquery-ui-sortable');
	wp_enqueue_script('jquery-ui-draggable');
	wp_enqueue_script('jquery-ui-tabs');
	wp_enqueue_script('suggest');
	wp_enqueue_script('suffusion-jquery-jscolor', get_template_directory_uri().'/admin/js/jscolor/jscolor.js', array('jquery'));

    wp_enqueue_script('jquery-ui-slider');
    wp_enqueue_script('jquery-ui-autocomplete');
    wp_enqueue_script('suffusion-admin', get_template_directory_uri().'/admin/js/admin.js', array('jquery-ui-slider', 'jquery-ui-autocomplete'), SUFFUSION_THEME_VERSION);

	$stored_options = get_option('suffusion_options');
	if (isset($stored_options) && is_array($stored_options) && isset($stored_options['last-set-section'])) {
		$category = $stored_options['last-set-section'];
	}
	else {
		$category = 'welcome';
	}
	$js_array = array(
		'category' => $category,
	);
	wp_localize_script('suffusion-admin', 'Suffusion_Admin_JS', $js_array);
}

function suffusion_admin_style_loader() {
	wp_enqueue_style('suffusion-admin-jq', get_template_directory_uri().'/admin/js/jquery-ui/css/jquery-ui-1.7.3.custom.css', array(), SUFFUSION_THEME_VERSION);
	wp_enqueue_style('suffusion-admin', get_template_directory_uri().'/admin/admin.css', array('suffusion-admin-jq'), SUFFUSION_THEME_VERSION);
}


/**
 * Checks if you are using a non-American-English version of the theme. If so, it checks where your translations are.
 * If you are using the core Suffusion theme:
 *  1. This prompts you to move your translations if found to a child theme
 *  2. Otherwise it provides a link to the page where translations can be got.
 * If you are using a child theme of Suffusion:
 *  1. If your translation file is in the core theme folder it suggests to move it to the child theme
 *  2. If there are no translation files in the core theme folder or the child theme folder, it points you to the translation page.
 *
 * @return string
 */
function suffusion_translation_checker() {
	if (!defined('WPLANG') || WPLANG == 'en' || WPLANG == '') {
		$lang = 'en_US';
	}
	else {
		$lang = WPLANG;
	}

	$message = "";
	if ($lang != 'en_US') {
		if (!is_child_theme()) {
			if (file_exists(get_template_directory()."/translation/$lang.mo")) {
				$message = "<div class='updated'>You are using a version of WordPress that is not in American English, and your translation files are in the theme's main folder.
					You will lose these files if you upgrade the theme. <a href='http://www.aquoid.com/news/themes/suffusion/translating-suffusion/#use-basic'>Move your translations to a child theme</a> instead.</div>";
			}
			else {
				$message = "<div class='updated'>You are using a version of WordPress that is not in American English.
					Translations for your language <a href='http://www.aquoid.com/news/themes/suffusion/translating-suffusion/'>might be available</a>.</div>";
			}
		}
		else {
			if (file_exists(get_template_directory()."/translation/$lang.mo") && !file_exists(get_stylesheet_directory()."/translation/$lang.mo")) {
				$message = "<div class='updated'>Your translation files are in Suffusion's folder. You will lose these files if you upgrade the theme.
					<a href='http://www.aquoid.com/news/themes/suffusion/translating-suffusion/#use-basic'>Move your translations to a child theme</a> instead.</div>";
			}
			else if (!file_exists(get_stylesheet_directory()."/translation/$lang.mo")) {
				$message = "<div class='updated'>You are using a version of WordPress that is not in American English.
					Translations for your language <a href='http://www.aquoid.com/news/themes/suffusion/translating-suffusion/'>might be available</a>.</div>";
			}
		}
	}
	return $message;
}

/**
 * Determines if you are running BP. If so, and if you don't have the Suffusion BuddyPress Pack installed, it directs you to install the same.
 * If the plugin is installed and you are not running it on a child theme, it recommends you to switch to a child theme.
 *
 * @return string
 */
function suffusion_bp_checker() {
	global $bp;
	$message = "";
	if (isset($bp)) {// Using BP
		if (!class_exists('Suffusion_BP_Pack')) {
			$message = "<div class='updated'>You are using BuddyPress. Please install the <a href='http://wordpress.org/extend/plugins/suffusion-buddypress-pack'>Suffusion BuddyPress Pack</a> for best results.
				See the <a href='http://www.aquoid.com/news/plugins/suffusion-buddypress-pack/'>plugin's home page</a> for further instructions.</div>";
		}
		else if (!is_child_theme()) {
			$message = "<div class='updated'>The <a href='http://wordpress.org/extend/plugins/suffusion-buddypress-pack'>Suffusion BuddyPress Pack</a> works best in a child theme.
				See the <a href='http://www.aquoid.com/news/plugins/suffusion-buddypress-pack/'>plugin's home page</a> for further instructions.</div>";
		}
	}
	return $message;
}

function suffusion_options_process_custom_type_option($option, $section, $suffusion_custom_type, $custom_type_name) {
	if (is_array($option)) {
		$required = "";
		if (isset($option['reqd'])) {
			$required = " <span class='note'>[Required *]</span> ";
		}
		switch ($option['type']) {
			case 'text':
				echo "<td>".$option['desc'].$required."</td>";
				if ($section != null) {
					if (isset($option['name']) && isset($suffusion_custom_type[$section][$option['name']])) {
						echo "<td><input name='{$custom_type_name}[$section][".$option['name']."]' type='text' value=\"".$suffusion_custom_type[$section][$option['name']]."\"/></td>";
					}
					else {
						echo "<td><input name='{$custom_type_name}[$section][".$option['name']."]' type='text' value=\"\"/></td>";
					}
				}
				else {
					if (isset($option['name']) && isset($suffusion_custom_type[$option['name']])) {
						echo "<td><input name='{$custom_type_name}[".$option['name']."]' type='text' value=\"".$suffusion_custom_type[$option['name']]."\"/></td>";
					}
					else {
						echo "<td><input name='{$custom_type_name}[".$option['name']."]' type='text' value=\"\"/></td>";
					}
				}
				break;

			case 'checkbox':
?>
		<td colspan='2'>
		<?php
				if ($section != null) {
		?>
			<input name='<?php echo $custom_type_name; ?>[<?php echo $section; ?>][<?php echo $option['name'];?>]' type='checkbox' value='1' <?php if (isset($suffusion_custom_type[$section][$option['name']])) checked('1', $suffusion_custom_type[$section][$option['name']]); ?> />
		<?php
				}
				else {
		?>
			<input name='<?php echo $custom_type_name; ?>[<?php echo $option['name'];?>]' type='checkbox' value='1' <?php if (isset($suffusion_custom_type[$option['name']])) checked('1', $suffusion_custom_type[$option['name']]); ?> />
		<?php
				}
		?>
			&nbsp;&nbsp;<?php echo $option['desc'].$required;?>
		</td>
<?php
		        break;

			case 'select':
?>
		<td><?php echo $option['desc'].$required;?></td>
		<td>
		<?php
				if ($section != null) {
					if (!isset($suffusion_custom_type[$section][$option['name']]) || $suffusion_custom_type[$section][$option['name']] == null) {
						$value = $option['std'];
					}
					else {
						$value = $suffusion_custom_type[$section][$option['name']];
					}
		?>
			<select name='<?php echo $custom_type_name; ?>[<?php echo $section; ?>][<?php echo $option['name'];?>]' >
		<?php
					foreach ($option['options'] as $dd_value => $dd_display) {
		?>
				<option value='<?php echo $dd_value;?>' <?php selected($value, $dd_value); ?> ><?php echo $dd_display; ?></option>
		<?php
					}
		?>

			</select>
		<?php
				}
				else {
					if (!isset($suffusion_custom_type[$option['name']]) || $suffusion_custom_type[$option['name']] == null) {
						$value = $option['std'];
					}
					else {
						$value = $suffusion_custom_type[$option['name']];
					}
		?>
			<select name='<?php echo $custom_type_name; ?>[<?php echo $option['name'];?>]' >
		<?php
					foreach ($option['options'] as $dd_value => $dd_display) {
		?>
				<option value='<?php echo $dd_value;?>' <?php selected($value, $dd_value); ?>><?php echo $dd_display; ?></option>
		<?php
					}
		?>

			</select>
		<?php
				}
		?>
		</td>
<?php
		        break;
		}
	}
}

add_action('wp_ajax_suffusion_quick_search', 'suffusion_quick_search');

/**
 * Helps search for options from the admin panel. This lazy-loads the options files to avoid burdening the server.
 *
 * @return void
 */
function suffusion_quick_search() {
	global $suffusion_intro_options, $suffusion_theme_skinning_options, $suffusion_visual_effects_options, $suffusion_sidebars_and_widgets_options, $suffusion_blog_features_options, $suffusion_templates_options, $suffusion_layouts_options, $suffusion_typography_options;
	$q = $_REQUEST['term'];

	include_once(get_template_directory().'/admin/theme-options.php');
	$inbuilt_options = array('intro' => $suffusion_intro_options, 'theme-skinning' => $suffusion_theme_skinning_options, 'visual-effects' => $suffusion_visual_effects_options,
		'layouts' => $suffusion_layouts_options, 'typography' => $suffusion_typography_options,
		'sidebars-and-widgets' => $suffusion_sidebars_and_widgets_options, 'blog-features' => $suffusion_blog_features_options, 'templates' => $suffusion_templates_options
	);

	$result = array();
	foreach ($inbuilt_options as $file => $options) {
		$qualifier_root = "";
		$qualifier_branch = "";
		foreach ($options as $option) {
			if (isset($option['type']) && $option['type'] == 'sub-section-2') {
				$qualifier_root = $option['name'];
			}
			if (isset($option['type']) && $option['type'] == 'sub-section-3') {
				$qualifier_branch = $option['name'];
			}
			$qualifier = " ($qualifier_root > $qualifier_branch)";
			if (isset($option['name']) && isset($option['id'])) {
				$key = $option['name'];
				$id = $option['id'];
				$parent = $option['parent'];
				$desc = isset($option['desc']) ? $option['desc'] : '';
				$desc = str_replace(array("\r\n", "\r", "\n", "\t"), '', $desc);
				$desc = str_replace(array('  ', '   ', '    ', '     '), ' ', $desc);
				$url = "?page=suffusion-options-manager&amp;tab=theme-options-$file.php#$parent";
				if (strpos(strtolower($key), $q) !== false || strpos(strtolower($desc), $q) !== false) {
					$desc = strip_tags($desc);
					$desc_arr = explode(' ', $desc);
					if (count($desc_arr) > 10) {
						$desc_arr = array_slice($desc_arr, 0, 10);
					}
					$desc = implode(' ', $desc_arr);
					array_push($result, array("id" => $id, "label" => $key.$qualifier, "value" => strip_tags($key.$qualifier), "url" => $url, "description" => strip_tags($desc)));
				}
			}
			if (count($result) > 11)
				break;
		}
	}
	echo suffusion_search_array_to_json($result);
	die();
}

function suffusion_search_array_to_json($array) {
	if (!is_array($array)) {
		return false;
	}

	$associative = count(array_diff(array_keys($array), array_keys(array_keys($array))));
	if ($associative) {
		$construct = array();
		foreach ($array as $key => $value) {
			// We first copy each key/value pair into a staging array,
			// formatting each key and value properly as we go.

			// Format the key:
			if (is_numeric($key)) {
				$key = "key_$key";
			}
			$key = "\"" . addslashes($key) . "\"";

			// Format the value:
			if (is_array($value)) {
				$value = json_encode($value);
			} else if (!is_numeric($value) || is_string($value)) {
				$value = "\"" . addslashes($value) . "\"";
			}

			// Add to staging array:
			$construct[] = "$key: $value";
		}

		// Then we collapse the staging array into the JSON form:
		$result = "{ " . implode(", ", $construct) . " }";
	}
	else { // If the array is a vector (not associative):
		$construct = array();
		foreach ($array as $value) {
			// Format the value:
			if (is_array($value)) {
				$value = suffusion_search_array_to_json($value);
			} else if (!is_numeric($value) || is_string($value)) {
				$value = "'" . addslashes($value) . "'";
			}

			// Add to staging array:
			$construct[] = $value;
		}

		// Then we collapse the staging array into the JSON form:
		$result = "[ " . implode(", ", $construct) . " ]";
	}

	return $result;
}
