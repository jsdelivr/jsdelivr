<?php
/**
 * Special handling for the status post format. It displays the Gravatar of the user, Twitter-style.
 *
 * @since 3.9.1
 * @package Suffusion
 * @subpackage Formats
 */
global $post;

$avatar = get_avatar(get_the_author_meta('user_email'), 64);
echo $avatar;
$continue = __('Continue reading &raquo;', 'suffusion');
the_content($continue);
