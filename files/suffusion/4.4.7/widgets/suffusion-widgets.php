<?php
/**
 * Loads up all the widgets defined by Suffusion. This functionality will be released as a plugin in a future release.
 *
 * @package Suffusion
 * @subpackage Widgets
 */

if (!class_exists('Suffusion_Widgets')) {
	class Suffusion_Widgets {
		function Suffusion_Widgets() {
		}

		function init() {
			add_action("widgets_init", array(&$this, "load_widgets"));
		}

		function load_widgets() {
			global $suf_module_widgets;
			$disabled_widgets = array();
			if (isset($suf_module_widgets)) {
				$disabled_widgets = explode(',', $suf_module_widgets);
			}
			$template_path = get_template_directory();
			include_once ($template_path . "/widget-areas.php");

			if (!in_array('search', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-search.php');
				register_widget("Suffusion_Search");
			}

			if (!in_array('twitter', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-twitter.php');
				register_widget("Suffusion_Follow_Twitter");
			}

			if (!in_array('query-posts', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-query-posts.php');
				register_widget("Suffusion_Category_Posts");
			}

			if (!in_array('featured-posts', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-featured-posts.php');
				register_widget("Suffusion_Featured_Posts");
			}

			if (!in_array('translator', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-translator.php');
				register_widget("Suffusion_Google_Translator");
			}

			if (!in_array('follow-me', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-subscription.php');
				register_widget("Suffusion_Subscription");
			}

			if (!in_array('flickr', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-flickr.php');
				register_widget("Suffusion_Flickr");
			}

			if (!in_array('query-users', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-query-users.php');
				register_widget("Suffusion_Query_Users");
			}

			if (!in_array('child-pages', $disabled_widgets)) {
				include_once ($template_path . '/widgets/suffusion-child-pages.php');
				register_widget("Suffusion_Child_Pages");
			}
		}
	}
}
