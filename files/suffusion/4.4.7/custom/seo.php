<?php
/**
 * This file handles SEO in Suffusion. It is not to be loaded directly, but is instead loaded from different templates.
 * Users can override this in a child theme by creating a file in an "inserts" directory called seo.php.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suf_seo_enabled, $suf_seo_all_settings;
if ($suf_seo_enabled == 'enabled') {
	$seo_settings = explode(',', $suf_seo_all_settings);
	if (is_array($seo_settings)) {
		if (in_array('generator', $seo_settings)) {
			wp_generator();
		}

		if (in_array('theme', $seo_settings)) {
            $theme_data = wp_get_theme(get_template_directory().'/style.css');
			echo "\t".'<meta name="template" content="'.esc_attr("{$theme_data['Title']} {$theme_data['Version']}").'" />'."\n";
		}

		if (in_array('robots', $seo_settings) && get_option('blog_public')) {
			echo "\t".'<meta name="robots" content="noindex,nofollow" />' . "\n";
		}

		if (in_array('author', $seo_settings)) {
			global $wp_query;
			if (is_singular()) {
				$author = get_the_author_meta('display_name', $wp_query->post->post_author);
			}
			else {
				$posts_on_page = $wp_query->posts;
				$author_array = array();
				foreach ($posts_on_page as $single_post) {
					$single_author = get_the_author_meta('display_name', $single_post->post_author);
					if (!in_array($single_author, $author_array)) {
						$author_array[] = get_the_author_meta('display_name', $single_post->post_author);
					}
				}
				$author = implode(',',$author_array);
			}

			if ($author) {
				echo "\t".'<meta name="author" content="'.esc_attr($author).'" />' . "\n";
			}
		}

		if (in_array('copyright', $seo_settings)) {
			if (is_singular()) {
				$copy_date = sprintf(get_the_time(get_option('date_format')));
			}
			else {
				$copy_date = date('Y');
			}
			echo "\t".'<meta name="copyright" content="'.sprintf(esc_attr__('Copyright (c) %1$s', 'suffusion'), $copy_date).'" />'."\n";
		}

		if (in_array('revised', $seo_settings)) {
			if (is_singular()) {
				$mod_time = sprintf(get_the_modified_time(get_option('date_format')." ".get_option('time_format')));
				echo "\t".'<meta name="revised" content="'.$mod_time.'" />'."\n";
			}
		}

	}

	global $suf_seo_meta_description, $wp_query;
	if (is_home()) {
		$description = $suf_seo_meta_description;
	}
	else if (is_singular()) {
		$description = suffusion_get_post_meta($wp_query->post->ID, "suf_meta_description", true);
		if (empty($description)) { // Check the old meta field
			$description = suffusion_get_post_meta($wp_query->post->ID, "meta_description", true);
		}
		if (empty($description) && is_front_page()) {
			$description = $suf_seo_meta_description;
		}
	}
	else if (is_category() || is_tag() || is_tax()) {
		$description = term_description('', get_query_var('taxonomy'));
	}
	else if (is_author()) {
		$description = get_the_author_meta('description', get_query_var('author'));
	}
	if (!empty($description)) {
		$description = stripslashes($description);
		$description = strip_tags($description);
		$description = str_replace(array("\r", "\n", "\t"), '', $description);
		$description = "\t".'<meta name="description" content="' . $description . '" />' . "\n";
		echo $description;
	}

	global $suf_seo_meta_keywords;
	if (is_home() || is_category() || is_tag() || is_tax() || is_author()) {
		$keywords = $suf_seo_meta_keywords;
	}
	else if (is_singular()) {
		$keywords = suffusion_get_post_meta($wp_query->post->ID, "suf_meta_keywords", true);
		if (empty($keywords)) { // Check the old meta field
			$keywords = suffusion_get_post_meta($wp_query->post->ID, "meta_keywords", true);
		}
		if (empty($keywords)) {
			$keywords = $suf_seo_meta_keywords;
		}
	}

	if (isset($keywords) && !empty($keywords)) {
		$keywords = stripslashes($keywords);
		$keywords = strip_tags($keywords);
		$keywords = str_replace(array("\r", "\n", "\t"), '', $keywords);
		$keywords = str_replace(array(", ", " ,"), ',', $keywords);
		$keywords = "\t".'<meta name="keywords" content="' . $keywords . '" />' . "\n";
		echo $keywords;
	}
}
?>