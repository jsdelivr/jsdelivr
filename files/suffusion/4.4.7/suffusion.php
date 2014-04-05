<?php
/**
 * Core class for Suffusion. This holds the options for the theme.
 *
 * @package Suffusion
 * @subpackage Functions
 */
class Suffusion {
	var $context, $body_layout, $content_layout, $user_agent;

	function init() {
		if (function_exists('icl_register_string')) {
			$this->set_translatable_fields();
		}
		$this->set_image_sizes();
		$this->body_layout = 'default';
		$this->content_layout = 'full-content';
	}

	function get_context() {
		global $wp_query;

		if (is_array($this->context)) {
			return $this->context;
		}

		$this->context = array();
		if (is_front_page()) {
			$this->context[] = 'home';
		}

		if (is_home()) {
			$this->context[] = 'blog';
		}

		if (is_singular()) {
			global $post;
			$this->context[] = 'singular';
			$this->context[] = "{$post->post_type}";
			if ($post->post_type == 'page') {
				$page_template = get_page_template();
				$path = get_template_directory();
				$stylesheet_path = get_stylesheet_directory();
				if (is_child_theme() && strlen($page_template) > strlen($stylesheet_path) && substr($page_template, 0, strlen($stylesheet_path)) == $stylesheet_path) {
					$path = $stylesheet_path;
				}
				if (strlen($page_template) > strlen($path)) {
					$page_template = substr($page_template, strlen($path) + 1);
					$this->context[] = 'page-template';
					$this->context[] = $page_template;
				}
			}

			if (is_page_template('magazine.php')) {
				$this->context[] = 'magazine';
			}
			$this->context[] = $post->post_type.'-'.$post->ID;
		}
		else if (is_archive()) {
			$this->context[] = 'archive';

			if (is_date()) {
				$this->context[] = 'date';
			}
			else if (is_category()) {
				$this->context[] = 'taxonomy';
				$this->context[] = 'category';
			}
			else if (is_tag()) {
				$this->context[] = 'taxonomy';
				$this->context[] = 'tag';
			}
			else if (is_author()) {
				$this->context[] = 'author';
			}
			else if (is_tax()) {
				$this->context[] = 'taxonomy';
				$tax = get_queried_object();
				$taxonomy = get_taxonomy($tax->taxonomy);
				$object_types = $taxonomy->object_type;
				$diff = array_diff($object_types, array('post', 'page'));
				if (count($diff) != 0) {
					$this->context[] = 'custom-taxonomy';
				}
			}

			if (is_post_type_archive()) {
				$this->context[] = 'custom-post-archive';
				$this->context[] = 'custom-post-archive-'.$wp_query->post_type;
			}
		}
		else if (is_search()) {
			$this->context[] = 'search';
		}
		else if (is_404()) {
			$this->context[] = '404';
		}

		return $this->context;
	}

	/**
	 * Adds WPML support for translating fields set in the admin panel.
	 *
	 * @return void
	 */
	function set_translatable_fields() {
		if (function_exists('icl_t')) {
			suffusion_set_translatable_fields();
		}
	}

	function set_image_sizes() {
		global $suf_excerpt_thumbnail_size, $suf_excerpt_thumbnail_custom_width, $suf_excerpt_thumbnail_custom_height, $suf_excerpt_tt_zc;
		global $suf_featured_image_size, $suf_featured_image_custom_width, $suf_featured_image_custom_height, $suf_featured_zc;
		global $suf_mag_headline_image_size, $suf_mag_headline_image_custom_height, $suf_mag_headline_image_custom_width, $suf_mag_headline_zc;
		global $suf_mag_excerpt_image_size, $suf_mag_excerpt_image_custom_height, $suf_mag_excerpt_image_custom_width, $suf_mag_excerpt_zc;
		global $suf_mosaic_thumbnail_height, $suf_mosaic_thumbnail_width, $suf_mosaic_zc, $suf_tile_image_size, $suf_tile_image_settings, $suf_tile_image_custom_width, $suf_tile_image_custom_height, $suf_tile_zc;
		global $suf_gallery_format_thumbnail_width, $suf_gallery_format_thumbnail_height, $suf_gallery_format_zc;
		global $suf_disable_auto_thumbs;
		if ($suf_excerpt_thumbnail_size == "custom") {
			$width = suffusion_admin_get_size_from_field($suf_excerpt_thumbnail_custom_width, '200px');
			$width = (int)(substr($width, 0, strlen($width) - 2));
			$height = suffusion_admin_get_size_from_field($suf_excerpt_thumbnail_custom_height, '200px');
			$height = (int)(substr($height, 0, strlen($height) - 2));
			$zc = $suf_excerpt_tt_zc == "0" ? false: true;
			add_image_size('excerpt-thumbnail', $width, $height, $zc);
		}
		if ($suf_featured_image_size == "custom") {
			$width = suffusion_admin_get_size_from_field($suf_featured_image_custom_width, '200px');
			$width = (int)(substr($width, 0, strlen($width) - 2));
			$height = suffusion_admin_get_size_from_field($suf_featured_image_custom_height, '200px');
			$height = (int)(substr($height, 0, strlen($height) - 2));
			$zc = $suf_featured_zc == "default" ? $suf_excerpt_tt_zc : $suf_featured_zc;
			$zc = $zc == "0" ? false: true;
			add_image_size('featured', $width, $height, $zc);
		}
		if ($suf_mag_headline_image_size == "custom") {
			$width = suffusion_admin_get_size_from_field($suf_mag_headline_image_custom_width, '200px');
			$width = (int)(substr($width, 0, strlen($width) - 2));
			$height = suffusion_admin_get_size_from_field($suf_mag_headline_image_custom_height, '200px');
			$height = (int)(substr($height, 0, strlen($height) - 2));
			$zc = $suf_mag_headline_zc == "default" ? $suf_excerpt_tt_zc : $suf_mag_headline_zc;
			$zc = $zc == "0" ? false: true;
			add_image_size('mag-headline', $width, $height, $zc);
		}
		if ($suf_mag_excerpt_image_size == "custom") {
			$width = suffusion_admin_get_size_from_field($suf_mag_excerpt_image_custom_width, '200px');
			$width = (int)(substr($width, 0, strlen($width) - 2));
			$height = suffusion_admin_get_size_from_field($suf_mag_excerpt_image_custom_height, '200px');
			$height = (int)(substr($height, 0, strlen($height) - 2));
			$zc = $suf_mag_excerpt_zc == "default" ? $suf_excerpt_tt_zc : $suf_mag_excerpt_zc;
			$zc = $zc == "0" ? false: true;
			add_image_size('mag-excerpt', $width, $height, $zc);
		}
		if ($suf_tile_image_size == "custom" && $suf_tile_image_settings == 'native') {
			$width = suffusion_admin_get_size_from_field($suf_tile_image_custom_width, '200px');
			$width = (int)(substr($width, 0, strlen($width) - 2));
			$height = suffusion_admin_get_size_from_field($suf_tile_image_custom_height, '200px');
			$height = (int)(substr($height, 0, strlen($height) - 2));
			$zc = $suf_tile_zc == "default" ? $suf_excerpt_tt_zc : $suf_tile_zc;
			$zc = $zc == "0" ? false: true;
			add_image_size('tile-thumb', $width, $height, $zc);
		}
		if (isset($suf_disable_auto_thumbs) && trim($suf_disable_auto_thumbs) != '') {
			$disabled = explode(',', $suf_disable_auto_thumbs);
		}
		else {
			$disabled = array();
		}
		if (!in_array('mosaic-thumb', $disabled)) {
			add_image_size('mosaic-thumb', $suf_mosaic_thumbnail_width, $suf_mosaic_thumbnail_height, $suf_mosaic_zc);
		}
		if (!in_array('gallery-thumb', $disabled)) {
			add_image_size('gallery-thumb', $suf_gallery_format_thumbnail_width, $suf_gallery_format_thumbnail_height, $suf_gallery_format_zc);
		}
		if (!in_array('widget-24', $disabled)) {
			add_image_size('widget-24', 24, 24, true);
		}
		if (!in_array('widget-32', $disabled)) {
			add_image_size('widget-32', 36, 36, true);
		}
		if (!in_array('widget-48', $disabled)) {
			add_image_size('widget-48', 48, 48, true);
		}
		if (!in_array('widget-64', $disabled)) {
			add_image_size('widget-64', 64, 64, true);
		}
		if (!in_array('widget-96', $disabled)) {
			add_image_size('widget-96', 96, 96, true);
		}
	}

	function set_body_layout($layout) {
		$this->body_layout = $layout;
	}

	function get_body_layout() {
		return $this->body_layout;
	}

	function set_content_layout($layout) {
		if ($layout == 'content') {
			$this->content_layout = 'full-content';
		}
		else {
			$this->content_layout = $layout;
		}
	}

	function get_content_layout() {
		return $this->content_layout;
	}
}
