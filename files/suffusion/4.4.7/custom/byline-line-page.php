<?php
/**
 * Shows the byline of a post/page in a single line. This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Users can override this in a child theme.
 *
 * @since 3.8.9
 * @package Suffusion
 * @subpackage Custom
 */

global $post, $suf_page_show_comment, $suf_page_show_posted_by, $suf_page_meta_position, $suf_byline_before_edit, $suf_byline_after_edit;
$format = suffusion_get_page_template();
if ($format == 'standard') {
	$format = '';
}
else {
	$format = $format . '_';
}
$show_posted_by = 'suf_page_show_posted_by';
$show_comment = 'suf_page_show_comment';

global $$show_posted_by, $$show_comment;
$post_show_posted_by = $$show_posted_by;
$post_show_comment = $$show_comment;

if ($post_show_posted_by != 'hide' || $post_show_comment != 'hide') { ?>
<div class='postdata line'>
	<?php
	if ($post_show_posted_by != 'hide') {
		suffusion_print_author_byline();
	}
	if (is_singular() && $post_show_comment != 'hide') {
		if ('open' == $post->comment_status) {
?>
			<span class="comments"><span class="icon">&nbsp;</span><a href="#respond"><?php _e('Add comments', 'suffusion'); ?></a></span>
<?php
		}
	}
	else if ($post_show_comment != 'hide') {
		echo "<span class='comments'><span class='icon'>&nbsp;</span>";
		comments_popup_link(__('No Responses', 'suffusion') . ' &#187;', __('1 Response', 'suffusion') . ' &#187;', __('% Responses', 'suffusion') . ' &#187;');
		echo "</span>";
	}

	if (get_edit_post_link() != '') {
		$prepend = apply_filters('suffusion_before_byline_html', do_shortcode($suf_byline_before_edit), 'edit');
		$append = apply_filters('suffusion_after_byline_html', do_shortcode($suf_byline_after_edit), 'edit');
		?>
		<span class="edit"><span class="icon">&nbsp;</span><?php edit_post_link(__('Edit', 'suffusion'), $prepend, $append); ?></span>
		<?php

	}
	?>
</div>
	<?php
}