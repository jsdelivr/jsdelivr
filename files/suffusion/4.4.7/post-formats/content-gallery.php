<?php
/**
 * Special handling for the Gallery post format. This tackles two displays separately: a gallery displayed as a part of an archive vis-a-vis a
 * gallery displayed by itself.
 *
 * @since 3.9.1
 * @package Suffusion
 * @subpackage Formats
 */

global $query_string, $post, $suf_gallery_format_thumb_count, $suf_gallery_format_thumb_panel_position, $suf_gallery_format_disable, $suf_gallery_random_thumbs_disable;

if (isset($suf_gallery_format_disable) && $suf_gallery_format_disable == 'on') {
	get_template_part('post-formats/content');
	return;
}

if (!is_single()) {
	echo "<div class='gallery-container fix'>";
	echo "<div class='gallery-leading'>";
	if (has_post_thumbnail()) {
		// use the thumbnail ("featured image")
		$thumb_id = get_post_thumbnail_id();
		the_post_thumbnail('full');
	}
	else {
		$attachments = get_children(
			array(
				'post_parent' => get_the_ID(),
				'post_status' => 'inherit',
				'post_type' => 'attachment',
				'post_mime_type' => 'image',
				'order' => 'ASC',
				'orderby' => 'menu_order ID',
				'numberposts' => 1,
			)
		);
		foreach ($attachments as $thumb_id => $attachment) {
			$src = wp_get_attachment_image($thumb_id, 'full');
			echo "<a href='".get_permalink()."' title='".esc_attr(get_the_title())."'>".$src."</a>";
		}
	}
	echo "</div>";

	$args = array(
		'post_parent' => get_the_ID(),
		'post_status' => 'inherit',
		'post_type' => 'attachment',
		'post_mime_type' => 'image',
		'orderby' => 'rand',
		'posts_per_page' => $suf_gallery_format_thumb_count,
		'post__not_in' => array($thumb_id),
		'update_post_term_cache' => false,
	);

	if (isset($suf_gallery_random_thumbs_disable) && $suf_gallery_random_thumbs_disable == 'on') {
		$args['orderby'] = 'menu_order ID';
		$args['order'] = 'ASC';
	}
	
	$images = new WP_Query($args);

	echo "<div class='gallery-contents $suf_gallery_format_thumb_panel_position'>";
	$content = $post->post_content;

	$thumbnails = array();
	foreach ($images->posts as $image) {
		$img = suffusion_get_image(array('gallery-thumb' => true, 'attachment-id' => $image->ID, 'no-link' => true));
		$title = get_the_title($image->ID);
		$thumbnails[] = '<a href="' . get_permalink($image->ID) . '" title="'.esc_attr($title).'">' . $img . '</a>';
	}
	$photo_count = $images->found_posts + 1;

	$mores = preg_match('/<!--more(.*?)?-->/', $content, $matches);
	$nextpages = preg_match('/<!--nextpage(.*?)?-->/', $content, $matches);
	if (!$mores && !$nextpages) {
		$content = strip_shortcodes($content); // We don't want the [gallery] shortcode to run here ...
		$content = apply_filters('the_content', $content); // ... but we don't want the formatting to get stripped bare either.
		echo $content;
	}
	else {
		the_content(sprintf(__('View %1$s photos', 'suffusion'), $photo_count).' &raquo;');
	}

	echo "<div class='gallery-thumbs'>";
	foreach ($thumbnails as $thumbnail) {
		echo $thumbnail;
	}
	echo "</div>";

	if (!$mores && !$nextpages) {
		echo "<div class='gallery-photo-counter fix'><a href='".get_permalink()."'>".sprintf(__('This gallery contains %1$s photos', 'suffusion'), $photo_count).'</a></div>';
	}
	echo "</div><!-- /.gallery-contents -->\n";
	echo "</div><!-- /.gallery-container -->\n";
}
else {
	$continue = __('Continue reading &raquo;', 'suffusion');
	the_content($continue);
}