<?php
/**
 * Functions specific to processing media. E.g. attachments
 */

/**
 * Fetches the attachment for a post. This delegates the call to the handler for the appropriate attachment type.
 * The theme has inbuilt functions for image, audio, application, text and video. You can add your own handlers for other types
 * by creating a function called suffusion_your_type_attachment, where replace your_type with the new mime type.
 * Replace all occurrences of "." and "-" by "_". E.g. vnd-ms-powerpoint will give you suffusion_vnd_ms_powerpoint_attachment.
 *
 * @param bool $echo
 * @return mixed|string|void
 */
function suffusion_attachment($echo = true) {
	$file = wp_get_attachment_url();
	$mime = get_post_mime_type();
	$mime_type = explode('/', $mime);
	// Reverse the array so that in mime type audio/mpeg, a call to the function for mpeg gets precedence over audio
	$mime_type = array_reverse($mime_type);
	$attachment = wp_get_attachment_link(0, 'full');

	foreach ($mime_type as $type) {
		$type = str_replace(array('.','-'), '_', $type);
		if (function_exists("suffusion_{$type}_attachment")) {
			$attachment = call_user_func("suffusion_{$type}_attachment", $attachment, $mime, $file);
			$attachment = apply_filters('suffusion_attachment_html', $attachment);
			if ($echo) echo $attachment;
			return $attachment;
		}
	}
	$mime_type_class = suffusion_get_mime_type_class();
	$attachment = "<div class='$mime_type_class'>$attachment</div>";
	if ($echo) echo $attachment;
	return $attachment;
}

/**
 * Uses the mime type of an attachment to determine the class. It first splits by "/", then replaces the occurrences of
 * "." and "_" with "-"
 *
 * @param string $mime
 * @return string
 */
function suffusion_get_mime_type_class($mime = '') {
	if ($mime == '') {
		$mime = get_post_mime_type();
	}

	$raw_mime_type = explode('/', $mime);
	$mime_type = array();
	foreach ($raw_mime_type as $mime_type_component) {
		$mime_type[] = str_replace(array('.', '_'), '-', $mime_type_component);
	}
	$mime_type_class = implode(' ', $mime_type);
	return $mime_type_class;
}

/**
 * Displays an image attachment. If enabled, the EXIF data for the image is displayed too.
 *
 * @param string $attachment
 * @param string $mime
 * @param string $file
 * @return string
 */
function suffusion_image_attachment($attachment = '', $mime = '', $file = '') {
	global $suf_image_show_exif, $suf_image_show_sizes;
	$display = apply_filters('suffusion_can_display_attachment', 'link', 'image');
	if ($display == false) {
		return "";
	}

	$ret = "";
	if ($suf_image_show_sizes == 'show') {
		$ret = suffusion_get_image_size_links();
	}
	$ret .= "<div class='image-container'>";
	$ret .= $attachment;
	$ret .= "</div>";
	if ($suf_image_show_exif == 'show') {
		$ret .= suffusion_get_image_exif_data();
	}

	return $ret;
}

/**
 * Provides links to all image sizes for a given attachment.
 * This is based on a method described by Justin Tadlock: http://justintadlock.com/archives/2011/01/28/linking-to-all-image-sizes-in-wordpress
 *
 * @return string
 */
function suffusion_get_image_size_links() {
	/* If not viewing an image attachment page, return. */
	if (!wp_attachment_is_image(get_the_ID()))
		return "";

	/* Set up an empty array for the links. */
	$links = array();

	/* Get the intermediate image sizes and add the full size to the array. */
	$sizes = get_intermediate_image_sizes();
	$sizes[] = 'full';

	/* Loop through each of the image sizes. */
	foreach ($sizes as $size) {
		/* Get the image source, width, height, and whether it's intermediate. */
		$image = wp_get_attachment_image_src(get_the_ID(), $size);

		/* Add the link to the array if there's an image and if $is_intermediate (4th array value) is true or full size. */
		if (!empty($image) && (true == $image[3] || 'full' == $size))
			$links[] = "<li><a class='image-size-link' href='{$image[0]}'>{$image[1]} &times; {$image[2]}</a></li>";
	}

	/* Join the links in a string and return. */
	$ret = join('', $links);
	$ret = "<ul class='image-sizes fix'>".$ret."</ul>";
	return $ret;
}

/**
 * Returns the EXIF data for images.
 *
 * @return string
 * @see http://www.walkernews.net/2009/04/13/turn-on-wordpress-feature-to-display-photo-exif-data-and-iptc-information/
 */
function suffusion_get_image_exif_data() {
	global $suf_image_exif_pieces;

	$exif_pieces = explode(',', $suf_image_exif_pieces);

	$ret = '<div class="exif-panel">';
	$ret .= '<table class="exif">';
	$image_meta = wp_get_attachment_metadata();

	// Start to display EXIF and IPTC data of digital photograph
	if (in_array('file', $exif_pieces))
		$ret .= "<tr>\n\t<td>".__('File', 'suffusion')."</td>\n\t<td>{$image_meta['file']}</td>\n</tr>\n";

	if (in_array('width', $exif_pieces))
		$ret .= "<tr>\n\t<td>".__('Width', 'suffusion')."</td>\n\t<td>{$image_meta['width']}px</td>\n</tr>\n";

	if (in_array('height', $exif_pieces))
		$ret .= "<tr>\n\t<td>".__('Height', 'suffusion')."</td>\n\t<td>{$image_meta['height']}px</td>\n</tr>\n";

	if (in_array('created_timestamp', $exif_pieces) && $image_meta['image_meta']['created_timestamp'])
		$ret .= "<tr>\n\t<td>".__('Date Taken', 'suffusion')."</td>\n\t<td>".date(get_option('date_format'), $image_meta['image_meta']['created_timestamp'])."</td>\n</tr>\n";

	if (in_array('copyright', $exif_pieces) && $image_meta['image_meta']['copyright'])
		$ret .= "<tr>\n\t<td>".__('Copyright', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['created_timestamp']}</td>\n</tr>\n";

	if (in_array('credit', $exif_pieces) && $image_meta['image_meta']['credit'])
		$ret .= "<tr>\n\t<td>".__('Credit', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['credit']}</td>\n</tr>\n";

	if (in_array('title', $exif_pieces) && $image_meta['image_meta']['title'])
		$ret .= "<tr>\n\t<td>".__('Title', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['title']}</td>\n</tr>\n";

	if (in_array('caption', $exif_pieces) && $image_meta['image_meta']['caption'])
		$ret .= "<tr>\n\t<td>".__('Caption', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['caption']}</td>\n</tr>\n";

	if (in_array('camera', $exif_pieces) && $image_meta['image_meta']['camera'])
		$ret .= "<tr>\n\t<td>".__('Camera', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['camera']}</td>\n</tr>\n";

	if (in_array('focal_length', $exif_pieces) && $image_meta['image_meta']['focal_length'])
		$ret .= "<tr>\n\t<td>".__('Focal Length', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['focal_length']}</td>\n</tr>\n";

	if (in_array('aperture', $exif_pieces) && $image_meta['image_meta']['aperture'])
		$ret .= "<tr>\n\t<td>".__('Aperture', 'suffusion')."</td>\n\t<td>f/{$image_meta['image_meta']['aperture']}</td>\n</tr>\n";

	if (in_array('iso', $exif_pieces) && $image_meta['image_meta']['iso'])
		$ret .= "<tr>\n\t<td>".__('ISO', 'suffusion')."</td>\n\t<td>{$image_meta['image_meta']['iso']}</td>\n</tr>\n";

	// Convert the shutter speed retrieved from database to fraction
	if (in_array('shutter_speed', $exif_pieces) && $image_meta['image_meta']['shutter_speed'] != 0) {
		if ((1 / $image_meta['image_meta']['shutter_speed']) > 1) {
				if ((number_format((1 / $image_meta['image_meta']['shutter_speed']), 1)) == 1.3 || number_format((1 / $image_meta['image_meta']['shutter_speed']), 1) == 1.5 ||
						number_format((1 / $image_meta['image_meta']['shutter_speed']), 1) == 1.6 || number_format((1 / $image_meta['image_meta']['shutter_speed']), 1) == 2.5) {
					$shutter_speed = "1/" . number_format((1 / $image_meta['image_meta']['shutter_speed']), 1, '.', '') . " second";
				}
				else {
					$shutter_speed = "1/" . number_format((1 / $image_meta['image_meta']['shutter_speed']), 0, '.', '') . " second";
				}
			}
			else {
				$shutter_speed = $image_meta['image_meta']['shutter_speed'] . " seconds";
			}
		$ret .= "<tr>\n\t<td>".__('Shutter Speed', 'suffusion')."</td>\n\t<td>$shutter_speed</td>\n</tr>\n";
	}

	$ret .= '</table>';
	$ret .= '</div>';
	$ret .= "<span class='exif-button fix'><a class='open' href='#'><span class='icon'>&nbsp;</span>".__('More Info', 'suffusion')."</a></span>";
	return $ret;
}

/**
 * Displays an audio attachment either as a link or as a browser-embedded object.
 *
 * @param string $attachment
 * @param string $mime
 * @param string $file
 * @return string
 */
function suffusion_audio_attachment($attachment = '', $mime = '', $file = '') {
	$mime_type_class = suffusion_get_mime_type_class($mime);
	$display = apply_filters('suffusion_can_display_attachment', 'link', 'audio');
	if ($display == false) {
		return "";
	}
	else if ($display == 'link') {
		return "<div class='attachment $mime_type_class'><span class='icon'>&nbsp;</span>$attachment</div>";
	}

	$ret = '<object type="' . $mime . '" class="player '.$mime_type_class.'" data="' . $file . '">';
	$ret .= '<param name="src" value="' . $file . '" />';
	$ret .= '<param name="autostart" value="false" />';
	$ret .= '<param name="controller" value="true" />';
	$ret .= '</object>';

	return $ret;
}

/**
 * Displays an application attachment either as a link or as a browser-embedded object.
 *
 * @param string $attachment
 * @param string $mime
 * @param string $file
 * @return string
 */
function suffusion_application_attachment($attachment = '', $mime = '', $file = '') {
	$mime_type_class = suffusion_get_mime_type_class($mime);
	$display = apply_filters('suffusion_can_display_attachment', 'link', 'application');
	if ($display == false) {
		return "";
	}
	else if ($display == 'link') {
		return "<div class='attachment $mime_type_class'><span class='icon'>&nbsp;</span>$attachment</div>";
	}

	$ret = '<object class="'.$mime_type_class.'" type="' . $mime . '" data="' . $file . '" width="400">';
	$ret .= '<param name="src" value="' . $file . '" />';
	$ret .= '</object>';

	return $ret;
}

/**
 * Displays a text attachment either as a link or as a browser-embedded object.
 *
 * @since 0.3
 * @param string $attachment
 * @param string $mime
 * @param string $file
 * @return string
 */
function suffusion_text_attachment($attachment = '', $mime = '', $file = '') {
	$mime_type_class = suffusion_get_mime_type_class($mime);
	$display = apply_filters('suffusion_can_display_attachment', 'link', 'text');
	if ($display == false) {
		return "";
	}
	else if ($display == 'link') {
		return "<div class='attachment $mime_type_class'><span class='icon'>&nbsp;</span>$attachment</div>";
	}

	$ret = '<object class="'.$mime_type_class.'" type="' . $mime . '" data="' . $file . '">';
	$ret .= '<param name="src" value="' . $file . '" />';
	$ret .= '</object>';

	return $ret;
}

/**
 * Displays a video attachment either as a link or as a browser-embedded object.
 *
 * @param string $attachment
 * @param string $mime
 * @param string $file
 * @return string
 */
function suffusion_video_attachment($attachment = '', $mime = '', $file = '') {
	$mime_type_class = suffusion_get_mime_type_class($mime);
	$display = apply_filters('suffusion_can_display_attachment', 'link', 'video');
	if ($display == false) {
		return "";
	}
	else if ($display == 'link') {
		return "<div class='attachment $mime_type_class'><span class='icon'>&nbsp;</span>$attachment</div>";
	}

	if ($mime == 'video/asf')
		$mime = 'video/x-ms-wmv';

	$ret = '<object type="' . $mime . '" class="player '.$mime_type_class.'" data="' . $file . '">';
	$ret .= '<param name="src" value="' . $file . '" />';
	$ret .= '<param name="autoplay" value="false" />';
	$ret .= '<param name="allowfullscreen" value="true" />';
	$ret .= '<param name="controller" value="true" />';
	$ret .= '</object>';

	return $ret;
}

/**
 * Image resizing method, based on the approach described by Victor Teixeira here: http://core.trac.wordpress.org/ticket/15311.
 * This will be replaced the day WP releases a well-designed dynamic resizer. Unlike TimThumb this doesn't use URL parameters to generate the image.
 * It instead relies on pre-defined (registered) sizes. A unique image is determined based on the resizing dimensions, the quality and the crop/no-crop of the resized image.
 * If the image has been already built in cache, that is returned. Otherwise a new image is created.
 *
 * If the JetPack Photon module is installed and activated, that can be used for resizing by this method.
 *
 * This method takes as input a URL corresponding to an image. The original method creates a resized copy in the same folder as the parent,
 * however that will not work here, due to the possiblity of an image on an external server. Instead the thumb-cache folder is used in the uploads directory (same as old versions).
 *
 * @param  $img_url
 * @param  $width
 * @param  $height
 * @param bool $crop
 * @param  $quality
 * @return array with image URL, width and height
 */
function suffusion_image_resize($img_url, $width, $height, $crop = false, $quality = null) {
	$upload_dir = wp_upload_dir();

	// This used to be the directory for the image cache prior to 3.7.2, so we will leave it that way...
	$upload_path = $upload_dir['basedir'].'/thumb-cache';
	if (!file_exists($upload_path)) { // Create the directory if it is missing
		wp_mkdir_p($upload_path);
	}

	$file_path = parse_url($img_url);
	if ($_SERVER['HTTP_HOST'] != $file_path['host'] && $file_path['host'] != '') {  // The image is not locally hosted
		$external_file = true;
		$remote_file_info = pathinfo($file_path['path']);// Can't use $img_url as the parameter because pathinfo includes the 'query' for the URL
		if (isset($remote_file_info['extension'])) {
			$remote_file_extension = $remote_file_info['extension'];
		}
		else {
			$remote_file_extension = 'jpg';
		}
		$remote_file_extension = strtolower($remote_file_extension);	// Not doing this creates multiple copies of a remote image.

		$file_base = md5($img_url).'.'.$remote_file_extension;

		// We will try to copy the file over locally. Otherwise WP's native image_resize() breaks down.
		$copy_to_file = $upload_dir['path'].'/'.$file_base;
		if (!file_exists($copy_to_file)) {
			$unique_filename = wp_unique_filename($upload_dir['path'], $file_base);
			// Using the HTTP API instead of our own CURL calls...
			$remote_content = wp_remote_request($img_url, array('sslverify' => false)); // Setting the sslverify argument, to prevent errors on HTTPS calls. A user embedding images in a post knows where he is pulling them from
			if (is_wp_error($remote_content)) {
				$copy_to_file = '';
			}
			else {
				// Not using file open functions, so you have to find your way around by using wp_upload_bits...
				wp_upload_bits($unique_filename, null, $remote_content['body']);
				$copy_to_file = $upload_dir['path'].'/'.$unique_filename;
			}
		}
		$file_path = $copy_to_file;
	}
	else {  // Locally hosted image
		$external_file = false;
		$file_path = suffusion_get_document_root($file_path['path']).$file_path['path'];
	}

	if (!file_exists($file_path)) {
		$resized_image = array(
			'url' => $img_url,
			'width' => $width,
			'height' => $height
		);
		return $resized_image;
	}

	$file_info = pathinfo($file_path);
	if (isset($file_info['extension'])) {
		$extension = '.'. $file_info['extension'];

		//Image quality is scaled down in case of PNGs, because PNG image creation uses a different scale for quality.
		if ($extension == '.png' && $quality != null) {
			$quality = floor(0.09 * $quality);
		}
	}

	global $suf_use_photon_resizing;
	if (!empty($suf_use_photon_resizing) && function_exists('jetpack_photon_url') &&
		class_exists('Jetpack') && method_exists('Jetpack', 'get_active_modules') && in_array('photon', Jetpack::get_active_modules())) {
		if ($external_file) {
			$img_path = $file_info['dirname'].'/'.$file_info['basename'];
			$img_path = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $img_path);
		}
		else {
			$img_path = $img_url;
		}

		$base = '';
		if (stripos($upload_dir['baseurl'], 'https://') === 0) {
			$base = 'https://i0.wp.com/';
			$img_path = substr_replace($img_path, '', 0, 8);
		}
		else if (stripos($upload_dir['baseurl'], 'http://') === 0) {
			$base = 'http://i0.wp.com/';
			$img_path = substr_replace($img_path, '', 0, 7);
		}

		$img_path = $base.$img_path;
		$arguments = array();
		if ($crop) {
			$arguments[] = 'resize='.$width.','.$height;
		}
		else {
			$arguments[] = 'fit='.$width.','.$height;
		}
		$arguments = implode('&', $arguments);
		if (!empty($arguments)) {
			$img_path .= '?'.$arguments;
		}

		$resized_image = array(
			'url' => $img_path,
			'width' => $width,
			'height' => $height
		);
		return $resized_image;
	}

	$orig_size = @getimagesize($file_path);
	$source[0] = $img_url;
	$source[1] = $orig_size[0];
	$source[2] = $orig_size[1];

	$crop_str = $crop ? '-crop' : '-nocrop';
	$quality_str = $quality != null ? '-' . $quality : '';
	$cropped_img_path = $upload_path.'/'.$file_info['filename'].'-'.md5($file_path).'-'.$width.'x'.$height.$quality_str.$crop_str.$extension;
	$suffix = md5($file_path).'-'.$width.'x'.$height.$quality_str.$crop_str;

	// Checking if the file size is larger than the target size
	// If it is smaller or the same size, stop right here and return
	if ($source[1] > $width || $source[2] > $height) {
		// Source file is larger, check if the resized version already exists (for $crop = true but will also work for $crop = false if the sizes match)
		if (file_exists($cropped_img_path)) {
			$cropped_img_url = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $cropped_img_path);

			$resized_image = array (
				'url' => $cropped_img_url,
				'width' => $width,
				'height' => $height
			);

			return $resized_image;
		}

		if ($crop == false) {
			// Calculate the size proportionally
			$proportional_size = wp_constrain_dimensions($source[1], $source[2], $width, $height);
			$resized_img_path = $upload_path.'/'.$file_info['filename'].'-'.md5($file_path).'-'.$proportional_size[0].'x'.$proportional_size[1].$quality_str.$crop_str.$extension;
			$suffix = md5($file_path).'-'.$proportional_size[0].'x'.$proportional_size[1].$quality_str.$crop_str;

			// Checking if the file already exists
			if (file_exists($resized_img_path)) {
				$resized_img_url = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $resized_img_path);

				$resized_image = array (
					'url' => $resized_img_url,
					'width' => $proportional_size[0],
					'height' => $proportional_size[1]
				);

				return $resized_image;
			}
		}

		// No cache files - let's finally resize it using WP's inbuilt resizer
		if (function_exists('wp_get_image_editor')) { // For WP 3.5+
			$editor = wp_get_image_editor($file_path);
			if (is_wp_error($editor)) {
				$new_img_path = $editor;
			}
			else {
				$editor->set_quality($quality);
				$resized = $editor->resize($width, $height, $crop);
				if (is_wp_error($resized)) {
					$new_img_path = $resized;
				}
				else {
					$dest_file = $editor->generate_filename($suffix, $upload_path);
					$saved = $editor->save($dest_file);
					if (is_wp_error($saved)) {
						$new_img_path = $saved;
					}
					else {
						$new_img_path = $dest_file;
					}
				}
			}
		}
		else { // For WP 3.4 and below
			$new_img_path = image_resize($file_path, $width, $height, $crop, $suffix, $upload_path, $quality);
		}
		if (is_wp_error($new_img_path)) {
			// We hit some errors. Let's just return the original image
			$resized_image = array(
				'url' => $source[0],
				'width' => $source[1],
				'height' => $source[2]
			);
		}
		else {
			$new_img_size = getimagesize($new_img_path);
			$new_img = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $new_img_path);

			// resized output
			$resized_image = array (
				'url' => $new_img,
				'width' => $new_img_size[0],
				'height' => $new_img_size[1]
			);
		}
		return $resized_image;
	}

	// default output - without resizing
	$resized_image = array (
		'url' => $source[0],
		'width' => $source[1],
		'height' => $source[2]
	);
	return $resized_image;
}

/**
 * Retrieves the URL of the image to be shown for a post. This is loosely based on the "Get the Image" plugin by Justin
 * Tadlock (http://wordpress.org/extend/plugins/get-the-image/). It picks the URL from one of the following:
 *  1. Native WP "Featured Image"
 *  2. Custom "Featured Image" field
 *  3. Custom "Thumbnail" field
 *  4. Attachment for a post
 *  5. Embedded URL in a post.
 *
 * The sequence for determining what to pick varies by the content type. You can set your order of preference from the options.
 * So, for featured content you might choose to give higher preference to the Custom "Featured Image" field, while for an excerpt you
 * might give preference to the Native WP "Featured Image"
 *
 * @param array $options
 * @return string
 */
function suffusion_get_image($options = array()) {
	global $post, $suf_excerpt_thumbnail_alignment, $suf_excerpt_thumbnail_size, $suf_featured_image_size, $suf_featured_image_custom_width, $suf_featured_image_custom_height;
	global $suf_mag_headline_image_size, $suf_mag_excerpt_image_size, $suf_excerpt_tt_zc, $suf_excerpt_tt_quality;
	global $suf_mag_excerpt_img_pref, $suf_mag_headline_img_pref, $suf_featured_img_pref, $suf_excerpt_img_pref, $suf_tile_img_pref, $suf_tile_image_size;

	$sequence_arrays = array('featured' => $suf_featured_img_pref, 'featured-widget' => $suf_featured_img_pref, 'mag-headline' => $suf_mag_headline_img_pref,
		'mag-excerpt' => $suf_mag_excerpt_img_pref, 'default' => $suf_excerpt_img_pref, 'widget-24' => $suf_excerpt_img_pref, 'widget-32' => $suf_excerpt_img_pref,
		'widget-48' => $suf_excerpt_img_pref, 'widget-64' => $suf_excerpt_img_pref, 'widget-96' => $suf_excerpt_img_pref, 'tile-thumb' => $suf_tile_img_pref,
		'gallery-thumb' => array('attachment'));
	$standard_sizes = array('thumbnail', 'medium', 'large');

	$full_size = false;
	$sequence = $sequence_arrays['default'];

	if ($suf_excerpt_thumbnail_size == 'custom') {
		$size = 'excerpt-thumbnail';
	}
	else if (in_array($suf_excerpt_thumbnail_size, $standard_sizes)) {
		$size = $suf_excerpt_thumbnail_size;
	}
	else {
		$full_size = true;
		$size = 'full';
	}

	if (isset($options['featured']) && $options['featured']) {
		$sequence = $sequence_arrays['featured'];
		if ($suf_featured_image_size == 'custom') {
			$full_size = false;
			$size = 'featured';
		}
		else {
			$full_size = true;
			$size = 'full';
		}
	}
	else if (isset($options['featured-widget']) && $options['featured-widget']) {
		$sequence = $sequence_arrays['featured'];
		$size = 'full';
		if ($options['featured-image-custom-size']) {
			// This is not a registered size, as it is set from the widget. So we will set the $height and $width parameters appropriately, but retrieve the 'full' size image.
			// Hence $size will stay at 'full'. Also, we will set special variables here for the desired size: $featured_width and $featured_height.
			// This will ensure that if the full-sized post thumbnail (i.e. $img will have 4 return values) is retrieved, the new full image
			// can be resized according to $featured_width and $featured_height.
			// In addition we will make $width and $height equal to $featured_width and $featured_height. This will mean that for non-post-thumbnails
			// the sizes remain untarnished.
			$featured_width = isset($options['featured-width']) ? $options['featured-width'] : suffusion_admin_get_size_from_field($suf_featured_image_custom_width, '200px');
			$featured_width = (int)(substr($featured_width, 0, strlen($featured_width) - 2));
			$featured_height = isset($options['featured-height']) ? $options['featured-height'] : suffusion_admin_get_size_from_field($suf_featured_image_custom_height, '200px');
			$featured_height = (int)(substr($featured_height, 0, strlen($featured_height) - 2));
			$width = $featured_width;
			$height = $featured_height;
			$full_size = false;
		}
		else {
			$full_size = true;
		}
	}
	else if (isset($options['mag-headline']) && $options['mag-headline']) {
		$sequence = $sequence_arrays['mag-headline'];
		if ($suf_mag_headline_image_size == 'custom') {
			$size = 'mag-headline';
			$full_size = false;
		}
	}
	else if (isset($options['mag-excerpt']) && $options['mag-excerpt']) {
		$sequence = $sequence_arrays['mag-excerpt'];
		if ($suf_mag_excerpt_image_size == 'custom') {
			$size = 'mag-excerpt';
			$full_size = false;
		}
	}
	else if (isset($options['tile-thumb']) && $options['tile-thumb']) {
		$sequence = $sequence_arrays['tile-thumb'];
		if ($suf_tile_image_size == 'custom') {
			$size = 'tile-thumb';
			$full_size = false;
		}
	}
	else if (isset($options['mosaic-thumb']) && $options['mosaic-thumb']) {
		$size = 'mosaic-thumb';
		$full_size = false;
	}
	else if (isset($options['widget-thumb'])) {
		$size = $options['widget-thumb'];
		$full_size = false;
	}
	else if (isset($options['gallery-thumb'])) {
		$size = 'gallery-thumb';
		$full_size = false;
	}

	if (is_array($size)) {
		$size = 'full';
	}

	if (!is_array($sequence)) { // Sequence has been explicitly set in the options. We need to break the string out into an array
		$sequence = explode(',', $sequence);
	}
	else { // Sequence has not been set explicitly and the default array exists. So we will retrieve its keys only.
		$sequence = array_keys($sequence);
	}

	$img = "";
	$original = array();
	if (isset($options['get-original']) && true === $options['get-original']) {
		$get_original = true;
	}
	else {
		$get_original = false;
	}

	foreach ($sequence as $position) {
		if (!is_null($img) && (is_array($img) || trim($img) != '')) {
			break;
		}
		switch ($position) {
			case 'native':
				$img = suffusion_get_image_by_post_thumbnail($size, $original, $get_original);
				continue;

			case 'custom-thumb':
				$img = suffusion_get_image_from_custom_field('suf_thumbnail');
				$original[0] = $img;
				continue;

			case 'attachment':
				if (isset($options['attachment-id'])) {
					$attachment_id = $options['attachment-id'];
				}
				else {
					$attachment_id = false;
				}
				$img = suffusion_get_image_from_attachment($size, $original, $get_original, $attachment_id, $options);
				if (isset($original['yapb']) && $original['yapb']) {
					$full_size = true;
				}
				continue;

			case 'embedded':
				$img = suffusion_get_image_from_embedded_url();
				$original[0] = $img;
				continue;

			case 'custom-featured':
				$img = suffusion_get_image_from_custom_field('suf_featured_image');
				$original[0] = $img;
		        continue;
		}
	}

	global $suffusion_original_image;
	$suffusion_original_image = $original;

	if (is_array($img)) {
		// This is either from an attachment or from a post thumbnail. If this is from the featured post widget, this is going to be a full-size image
		// (since we cannot use add_image_size() for the widget parameters). So we will set the $width and $height parameters to the desired
		// sizes and resize later. Otherwise we can set the $width and $height to the values returned with the $img url
		$width = isset($featured_width) ? $featured_width: $img[1];
		$height = isset($featured_height) ? $featured_height: $img[2];
		$intermediate = $img[3];
		$img = $img[0];
	}

	if (!isset($width) || !isset($height)) {
		// Retrieve the physical sizes from the named size.
		global $_wp_additional_image_sizes;
		if (isset($_wp_additional_image_sizes[$size])) {
			$size_array = $_wp_additional_image_sizes[$size];
			$width = $size_array['width'];
			$height = $size_array['height'];
			$crop = $size_array['crop'];
		}
		else if (in_array($size, $standard_sizes)) {
			$width = get_option($size.'_size_w');
			$height = get_option($size.'_size_h');
		}
		else {
			$width = get_option('full_size_w');
			$height = get_option('full_size_h');
		}
	}

	if (trim($img) != "") {
		// An image has been returned. Let us determine if we need to resize it. We will resize it if we don't want a full size image.
		// If the image returned is not an intermediate size (set only for thumbnails), we will do a physical resize.
		if (!$full_size && function_exists('imagecreatetruecolor') &&
				((isset($intermediate) && !$intermediate) || !isset($intermediate))) {
			if (is_multisite()) {
				// Special handling for rewrite rules in MS installations.
				global $blog_id;
				if (isset($blog_id) && $blog_id > 0) {
					$imageParts = explode('/files/', $img);
					if (isset($imageParts[1])) {
						$img = '/wp-content/blogs.dir/' . $blog_id . '/files/' . $imageParts[1];
					}
				}
			}
			$crop = isset($crop) ? $crop : ($suf_excerpt_tt_zc == "0");
			$resized_img = suffusion_image_resize($img, $width, $height, $crop, $suf_excerpt_tt_quality);
			$img = $resized_img['url'];
		}

		if (isset($original['yapb'])) {
			$image_html = $img;
		}
		else if (isset($options["featured"]) || isset($options['featured-widget'])) {
			$image_html = "<img src=\"".$img."\" alt=\"".esc_html($post->post_title)."\" class=\"featured-excerpt-".$options["excerpt_position"]."\"/>";
		}
		else if (isset($options['mag-headline']) || isset($options['mag-excerpt']) || isset($options['tile-thumb'])) {
			$a_class = 'fix';
			$image_html = "<img src=\"".$img."\" alt=\"".esc_html($post->post_title)."\" />";
		}
		else if (isset($options['mosaic-thumb'])) {
			$image_html = "<img src=\"".$img."\" alt=\"".esc_html($post->post_title)."\" class='suf-mosaic-img' />";
		}
		else if (isset($options['widget-thumb'])) {
			$image_html = "<img src=\"".$img."\" alt=\"".esc_html($post->post_title)."\" class='suf-widget-thumb' />";
		}
		else {
			$a_class = 'suf-thumbnail-anchor-'.$suf_excerpt_thumbnail_alignment;
			$image_html = "<img src=\"".$img."\" alt=\"".esc_html($post->post_title)."\" class=\"$suf_excerpt_thumbnail_alignment-thumbnail\"/>";
		}

		if (isset($options['no-link']) && $options['no-link']) {
			return $image_html;
		}
		else {
			$title = "";
			$a_id = "";
			if (isset($options['show-title'])) {
				$title = "title=\"".esc_attr($post->post_title)."\"";
			}
			if (isset($options['mosaic-thumb'])) {
				$a_id = "id=\"suf-mosaic-thumb-".$post->ID."\"";
			}
			return "<a href=\"".get_permalink($post->ID)."\" $a_id $title class='".(isset($a_class) ? $a_class : '')."'>$image_html</a>";
		}
	}
	else {
		return "";
	}
}

/**
 * Retrieves an image based on the attachments for a particular post.
 *
 * @param string $size
 * @param array $original
 * @param bool $get_original
 * @param bool $attachment_id
 * @param array $options
 * @return array|bool|mixed|string|void
 */
function suffusion_get_image_from_attachment($size = 'thumbnail', &$original = array(), $get_original = false, $attachment_id = false, $options = array()) {
	global $post;
	$img = "";
	if (!$attachment_id) {
		$attachments = get_children(array('post_parent' => $post->ID, 'post_status' => 'inherit', 'post_type' => 'attachment',
			'post_mime_type' => 'image', 'order' => 'ASC', 'orderby' => 'menu_order'));
		if (is_array($attachments)) {
			foreach ($attachments as $id => $attachment) {
				$img = wp_get_attachment_image_src($id, $size);
				if ($img && $get_original) {
					$original = wp_get_attachment_image_src($id, 'full');
				}
				break;
			}
		}
	}
	else {
		$img = wp_get_attachment_image_src($attachment_id, $size);
	}

	// Try YAPB
	if (($img == "" || (is_array($img) && count($img) == 0)) && function_exists('yapb_is_photoblog_post') && yapb_is_photoblog_post()) {
		$standard_sizes = array('thumbnail', 'medium', 'large');
		if (!isset($width) || !isset($height)) {
			// Retrieve the physical sizes from the named size.
			global $_wp_additional_image_sizes;
			if (isset($_wp_additional_image_sizes[$size])) {
				$size_array = $_wp_additional_image_sizes[$size];
				$width = $size_array['width'];
				$height = $size_array['height'];
			}
			else if (in_array($size, $standard_sizes)) {
				$width = get_option($size.'_size_w');
				$height = get_option($size.'_size_h');
			}
			else {
				$width = get_option('full_size_w');
				$height = get_option('full_size_h');
			}
			if (isset($options["featured"]) || isset($options['featured-widget'])) {
				$img_class = "featured-excerpt-".$options["excerpt_position"];
			}
			else if (isset($options['mag-headline']) || isset($options['mag-excerpt']) || isset($options['tile-thumb'])) {
				$img_class = '';
			}
			else if (isset($options['mosaic-thumb'])) {
				$img_class = 'suf-mosaic-img';
			}
			else if (isset($options['widget-thumb'])) {
				$img_class = 'suf-widget-thumb';
			}
			else {
				global $suf_excerpt_thumbnail_alignment;
				$img_class = $suf_excerpt_thumbnail_alignment.'-thumbnail';
			}

			$img = yapb_get_thumbnail('', array('alt' => esc_attr($post->post_title)), '', array("w=$width", "h=$height", "q=100"), $img_class);
			$original['yapb'] = true;
		}
	}
	return $img;
}

/**
 * Retrieves an image if a Native "Featured Image" is attached to the post.
 *
 * @param string $size
 * @param array $original
 * @param bool $get_original
 * @return array|bool|string
 */
function suffusion_get_image_by_post_thumbnail($size = 'excerpt-thumbnail', &$original = array(), $get_original = false) {
	global $post;
	if (has_post_thumbnail()) {
		// Problem with using get_the_post_thumbnail() here is that the image might not be resized correctly, so instead we
		// use wp_get_attachment_image_src, (which is used internally by get_the_post_thumbnail()), and that returns the resized dimensions with the URL.
		$attachment_id = get_post_thumbnail_id($post->ID);
		$img = wp_get_attachment_image_src($attachment_id, $size, false);
		if ($img && $get_original) {
			$original = wp_get_attachment_image_src($attachment_id, 'full');
		}
		return $img;
	}
	else {
		return "";
	}
}

/**
 * Retrieve an image URL based a custom field. A good use case for this call is if you want different images for your thumbnails and featured content.
 *
 * @param string $meta_field
 * @return mixed
 */
function suffusion_get_image_from_custom_field($meta_field = 'thumbnail') {
	global $post;
	$img = suffusion_get_post_meta($post->ID, $meta_field, true);
	return $img;
}

/**
 * Finds an image in a post by looking for the first embedded <img> tag. This can be used to pull external images from the post,
 * though it would work even for internal posts.
 *
 * @return string
 */
function suffusion_get_image_from_embedded_url() {
	global $post;
	$img = "";
	preg_match_all('|<img.*?src=[\'"](.*?)[\'"].*?>|i', $post->post_content, $images);
	if (isset($images) && isset($images[1]) && isset($images[1][0]) && $images[1][0]) {
		$img = $images[1][0];
	}
	return $img;
}

/**
 * Augmentation to the $_SERVER['DOCUMENT_ROOT'] functionality, because it cannot be relied on to provide the right path
 * in cases where there is URL rewriting at play.
 *
 * @param  $path
 * @return mixed|string
 */
function suffusion_get_document_root($path) {
	// If the file exists under DOCUMENT_ROOT, return DOCUMENT_ROOT
	if (@file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $path)) {
		return $_SERVER['DOCUMENT_ROOT'];
	}

	// Get the path of the current script, then compare it with DOCUMENT_ROOT. Then check for the file in each folder.
	$parts = array_diff(explode('/', $_SERVER['SCRIPT_FILENAME']), explode('/', $_SERVER['DOCUMENT_ROOT']));
	$new_path = $_SERVER['DOCUMENT_ROOT'];
	foreach ($parts as $part) {
		$new_path .= '/' . $part;
		if (@file_exists($new_path . '/' . $path)) {
			return $new_path;
		}
	}

	// Microsoft Servers
	if (!isset($_SERVER['DOCUMENT_ROOT'])) {
		$new_path = str_replace("/", "\\", $_SERVER['ORIG_PATH_INFO']);
		$new_path = str_replace($new_path, "", $_SERVER['SCRIPT_FILENAME']);

		if (@file_exists($new_path . '/' . $path)) {
			return $new_path;
		}
	}
	return false;
}

/**
 * Returns an array of audio files in the document. It first tries to search for audio attachments. If none is found, it looks for the use of
 * the [audio] shortcode. If none is found, it scans the embedded URLs.
 *
 * @return array|string
 */
function suffusion_get_audio() {
	$audios = suffusion_get_audio_from_shortcode();
	if (is_array($audios) && count($audios) != 0) {
		return array('shortcode' => $audios);
	}
	$audios = suffusion_get_audio_from_attachment();
	if (is_array($audios) && count($audios) != 0) {
		return array('attachment' => $audios);
	}
	$audios = suffusion_get_audio_from_embedded_url();
	if (is_array($audios) && count($audios) != 0) {
		return array('embedded' => $audios);
	}
	return array();
}

/**
 * Returns all attachments with mime_type 'audio'. Only the URL is returned.
 *
 * @return array
 */
function suffusion_get_audio_from_attachment() {
	global $post;
	$attachments = get_children(array('post_parent' => $post->ID, 'post_status' => 'inherit', 'post_type' => 'attachment',
		'post_mime_type' => 'audio', 'order' => 'ASC', 'orderby' => 'menu_order'));
	$ret = array();
	if (is_array($attachments)) {
		foreach ($attachments as $attachment) {
			$ret[] = get_the_guid($attachment->ID);
		}
	}
	return $ret;
}

/**
 * Scans the post for occurrences of the 'audio' shortcode. If found, it returns an array with the URLs of all the matches.
 *
 * @return array
 */
function suffusion_get_audio_from_shortcode() {
	$shortcode_matches = suffusion_detect_shortcode('audio');
	if ($shortcode_matches && isset($shortcode_matches[3])) {
		return $shortcode_matches[3];
	}
	return array();
}

/**
 * Finds an audio file in a post by looking for the first embedded <a> tags. This can be used to pull external audio files from the post,
 * though it would work even for internal files.
 *
 * @return string
 */
function suffusion_get_audio_from_embedded_url() {
	global $post;
	$audios = array();
	preg_match_all('|<a.*?href=[\'"](.*?)[\'"].*?>|i', $post->post_content, $links);
	if (isset($links) && isset($links[1]) && is_array($links[1])) {
		foreach ($links[1] as $link) {
			$dot_pos = strrpos($link, '.');
			if ($dot_pos < strlen($link)) {
				$extension = substr($link, $dot_pos + 1);
				if (wp_ext2type($extension) == 'audio') {
					$audios[] = $link;
				}
			}
		}
	}
	return $audios;
}
