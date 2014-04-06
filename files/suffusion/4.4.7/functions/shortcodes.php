<?php
/**
 * Contains a list of all custom shortcodes and corresponding functions defined for Suffusion.
 * This file is included in framework.php
 *
 * With effect from Suffusion 4.3.2 this code is being deprecated in favour of the "Suffusion Shortcodes" plugin.
 * This file is only included if the "Suffusion Shortcodes" plugin is not present.
 *
 * @package Suffusion
 * @subpackage Functions
 */

add_shortcode('suffusion-categories', 'suffusion_sc_list_categories');
add_shortcode('suffusion-the-year', 'suffusion_sc_the_year');
add_shortcode('suffusion-site-link', 'suffusion_sc_site_link');
add_shortcode('suffusion-the-author', 'suffusion_sc_the_author');
add_shortcode('suffusion-the-post', 'suffusion_sc_the_post');
add_shortcode('suffusion-login-url', 'suffusion_sc_login_url');
add_shortcode('suffusion-logout-url', 'suffusion_sc_logout_url');
add_shortcode('suffusion-loginout', 'suffusion_sc_loginout');
add_shortcode('suffusion-register', 'suffusion_sc_register');
add_shortcode('suffusion-adsense', 'suffusion_sc_ad');
add_shortcode('suffusion-tag-cloud', 'suffusion_sc_tag_cloud');
add_shortcode('suffusion-flickr', 'suffusion_sc_flickr');

// Check for the JetPack [audio] shortcode and the WP Audio Player plugin. If neither exist AND the user has enabled the audio shortcode, only then define our audio shortcode.
if (!function_exists('audio_shortcode') && !class_exists('AudioPlayer')) {
	$global_options = get_option('suffusion_options');
	if (isset ($global_options['suf_enable_audio_shortcode']) && $global_options['suf_enable_audio_shortcode'] == 'on') {
		add_shortcode('audio', 'suffusion_sc_audio');
	}
}

function suffusion_sc_list_categories($attr) {
	if (isset($attr['title_li'])) {
		$attr['title_li'] = suffusion_shortcode_string_to_bool($attr['title_li']);
	}
	if (isset($attr['hierarchical'])) {
		$attr['hierarchical'] = suffusion_shortcode_string_to_bool($attr['hierarchical']);
	}
	if (isset($attr['use_desc_for_title'])) {
		$attr['use_desc_for_title'] = suffusion_shortcode_string_to_bool($attr['use_desc_for_title']);
	}
	if (isset($attr['hide_empty'])) {
		$attr['hide_empty'] = suffusion_shortcode_string_to_bool($attr['hide_empty']);
	}
	if (isset($attr['show_count'])) {
		$attr['show_count'] = suffusion_shortcode_string_to_bool($attr['show_count']);
	}
	if (isset($attr['show_last_update'])) {
		$attr['show_last_update'] = suffusion_shortcode_string_to_bool($attr['show_last_update']);
	}
	if (isset($attr['child_of'])) {
		$attr['child_of'] = (int)$attr['child_of'];
	}
	if (isset($attr['depth'])) {
		$attr['depth'] = (int)$attr['depth'];
	}
	$attr['echo'] = false;

	$output = wp_list_categories( $attr );

	return $output;
}

function suffusion_sc_the_year() {
	return date('Y');
}

function suffusion_sc_site_link() {
	return '<a class="site-link" href="'.get_bloginfo('url').'" title="'.esc_attr(get_bloginfo('name')).'" rel="home">'.get_bloginfo('name').'</a>';
}

function suffusion_sc_the_author($attr) {
	global $suffusion_social_networks;
	$id = get_the_author_meta('ID');
	if ($id) {
		if (isset($attr['display'])) {
			$display = $attr['display'];
			switch ($display) {
				case 'author':
					return get_the_author();
				case 'modified-author':
					return get_the_modified_author();
				case 'description':
					return get_the_author_meta('description', $id);
				case 'login':
					return get_the_author_meta('user_login', $id);
				case 'first-name':
					return get_the_author_meta('first_name', $id);
				case 'last-name':
					return get_the_author_meta('last_name', $id);
				case 'nickname':
					return get_the_author_meta('nickname', $id);
				case 'id':
					return $id;
				case 'url':
					return get_the_author_meta('user_url', $id);
				case 'email':
					return get_the_author_meta('user_email', $id);
				case 'link':
					if (get_the_author_meta('user_url', $id)) {
						return '<a href="'.get_the_author_meta('user_url', $id).'" title="'.esc_attr(get_the_author()).'" rel="external">'.get_the_author().'</a>';
					}
					else {
						return get_the_author();
					}
				case 'aim':
					return get_the_author_meta('aim', $id);
				case 'yim':
					return get_the_author_meta('yim', $id);
				case 'posts':
					return get_the_author_posts();
				case 'posts-url':
					return get_author_posts_url(get_the_author_meta('ID'));
			}
			if (isset($suffusion_social_networks) && isset($suffusion_social_networks[$display]) && $suffusion_social_networks[$display]) {
				return get_the_author_meta($display, $id);
			}
		}
		else {
			return get_the_author();
		}
	}
}

function suffusion_sc_the_post($attr) {
	global $post;
	$id = $post->ID;
	if (isset($attr['display'])) {
		$display = $attr['display'];
		if ($id) {
			switch ($display) {
				case 'id':
					return $id;
				case 'title':
					return get_the_title($id);
				case 'permalink':
					return get_permalink($id);
				default:
					return get_the_title($id);
			}
		}
	}
	else {
		return get_the_title($id);
	}
}

function suffusion_sc_login_url($attr) {
	return wp_login_url($attr['redirect']);
}

function suffusion_sc_logout_url($attr) {
	return wp_logout_url($attr['redirect']);
}

function suffusion_sc_loginout($attr) {
	if (!is_user_logged_in())
		$link = '<a href="' . esc_url(wp_login_url($attr['redirect'])) . '">' . __('Log in', 'suffusion') . '</a>';
	else
		$link = '<a href="' . esc_url(wp_logout_url($attr['redirect'])) . '">' . __('Log out', 'suffusion') . '</a>';

	$filtered = apply_filters('loginout', $link);
	return $filtered;
}

function suffusion_sc_register($attr) {
	$before = $attr['before'] ? $attr['before'] : '<li>';
	$after = $attr['after'] ? $attr['after'] : '</li>';
	if (!is_user_logged_in()) {
		if (get_option('users_can_register') )
			$link = $before . '<a href="' . site_url('wp-login.php?action=register', 'login') . '">' . __('Register', 'suffusion') . '</a>' . $after;
		else
			$link = '';
	} else {
		$link = $before . '<a href="' . admin_url() . '">' . __('Site Admin', 'suffusion') . '</a>' . $after;
	}

	$filtered = apply_filters('register', $link);
	return $filtered;
}

function suffusion_sc_ad($attr) {
	$params = array('client', 'slot', 'width', 'height');
	$provider = 'google';
	$provider_type = 'syndication';
	$service = 'ad';
	$service_type = 'page';
	$ret = "<div id='".$service."sense'>\n<script type='text/javascript'><!--\n";
	foreach ($params as $var) {
		$ret .= "\t".$provider."_".$service."_$var = '".$attr[$var]."';\n";
	}
	$ret .= "//-->\n</script>\n";
	$service_url = "http://".$service_type.$service."2.$provider$provider_type.com/$service_type$service/show_{$service}s.js";
	$ret .= "<script type='text/javascript' src='$service_url'></script>\n";
	$ret .= "</div>\n";
	return $ret;
}

function suffusion_sc_tag_cloud($attr) {
	if (isset($attr['smallest'])) $attr['smallest'] = (int)$attr['smallest'];
	if (isset($attr['largest'])) $attr['largest'] = (int)$attr['largest'];
	if (isset($attr['number'])) $attr['number'] = (int)$attr['number'];
	$attr['echo'] = false;
	return wp_tag_cloud($attr);
}

function suffusion_shortcode_string_to_bool($value) {
	if ($value == true || $value == 'true' || $value == 'TRUE' || $value == '1') {
		return true;
	}
	else if ($value == false || $value == 'false' || $value == 'FALSE' || $value == '0') {
		return false;
	}
	else {
		return $value;
	}
}

/**
 * Prints a Flickr stream. The short code takes the following arguments:
 *  - id: Mandatory, can be obtained from http://idgettr.com using your photo stream's URL
 *  - type: Mandatory. Legitimate values: user, group.
 *  - size: Optional. Values: s (square), t (thumbnail), m (mid-size). Default: s
 *  - number: Optional. Default: 10
 *  - order: Optional. Values: latest, random. Default: latest
 *  - layout: Optional. Values: h (horizontal), v (vertical), x (no layout - user-styled). Default: x
 *
 * @param  $attr
 * @return string
 */
function suffusion_sc_flickr($attr) {
	if (!isset($attr['id']) || !isset($attr['type'])) {
		return "";
	}
	$id = $attr['id'];
	$type = $attr['type'];
	$size = isset($attr['size']) ? $attr['size'] : 's';
	$number = isset($attr['number']) ? $attr['number'] : 10;
	$order = isset($attr['order']) ? $attr['order'] : 'latest';
	$layout = isset($attr['layout']) ? $attr['layout'] : 'x';

	return "<div class='suf-flickr-stream'><script type=\"text/javascript\" src=\"http://www.flickr.com/badge_code_v2.gne?count=$number&amp;display=$order&amp;size=$size&amp;layout=$layout&amp;source=$type&amp;$type=$id\"></script></div>";
}

function suffusion_sc_audio($atts) {
	global $suffusion_audio_instance;
	if (!isset($suffusion_audio_instance)) {
		$suffusion_audio_instance = 1;
	}
	else {
		$suffusion_audio_instance++;
	}

	if (!isset($atts[0]))
		return '';

	if (count($atts))
		$atts[0] = join(' ', $atts);

	$src = rtrim($atts[0], '=');
	$src = trim($src, ' "');
	$data = preg_split("/[\|]/", $src);

	$sound_file = $data[0];

	return "<p id=\"audioplayer_$suffusion_audio_instance\"></p><script type=\"text/javascript\">AudioPlayer.embed(\"audioplayer_$suffusion_audio_instance\", {soundFile: \"$sound_file\", width: 300, initialvolume: 100, transparentpagebg: 'yes', left: '000000', lefticon: 'FFFFFF' });</script>";
}
