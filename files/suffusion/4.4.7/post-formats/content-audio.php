<?php
/**
 * Special handling for the Audio post format. It tries to look for the usage of the [audio] shortcode, audio file attachments, and audio links
 * in a post. If not a shortcode match, it displays the matched file in an Audio Player.
 * Users can override this file in a child theme by creating a file called content-audio.php in a folder called 'post-formats'.
 *
 * The Audio Player used is the standalone version from http://wpaudioplayer.com.
 *
 * @since 3.9.1
 * @package Suffusion
 * @subpackage Formats
 */

$audios = suffusion_get_audio();
if (is_array($audios) && count($audios) > 0) {
	if (!array_key_exists('shortcode', $audios)) { // We won't process shortcode responses because the Audio Player will get displayed for them automatically
		$audios = array_pop($audios);
		if (is_array($audios) && count($audios) > 0) {
			$audio = $audios[0];
			echo suffusion_sc_audio(array($audio));
		}
	}
}

$continue = __('Continue reading &raquo;', 'suffusion');
the_content($continue);
