<?php
/**
 * Shows the byline of a post/page in a single line. This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Users can override this in a child theme.
 *
 * @since 3.8.9
 * @package Suffusion
 * @subpackage Custom
 */

global $post, $suf_page_show_comment, $suf_page_show_posted_by, $suf_page_meta_position, $suf_date_box_show, $suffusion_cpt_post_id,
       $suffusion_cpt_layouts, $suf_byline_before_permalink, $suf_byline_after_permalink, $suf_byline_before_date, $suf_byline_after_date,
       $suf_byline_before_category, $suf_byline_after_category, $suf_byline_before_tag, $suf_byline_after_tag, $suf_byline_before_edit, $suf_byline_after_edit;
wp_reset_postdata(); // Clear out any changes to the "post" variable

$format = suffusion_get_post_format();
if ($format == 'standard') {
	$format = '';
}
else {
	$format = $format . '_';
}
if (is_single() && $post->post_type != 'post') {
	$is_cpt = true;
}
else {
	$is_cpt = false;
}

$show_cats = 'suf_post_' . $format . 'show_cats';
$show_tags = 'suf_post_' . $format . 'show_tags';
$show_posted_by = (!isset($suffusion_cpt_post_id) && !$is_cpt) ? 'suf_post_' . $format . 'show_posted_by' : 'suf_cpt_bylines_posted_by';
$show_comment = (!isset($suffusion_cpt_post_id) && !$is_cpt) ? 'suf_post_' . $format . 'show_comment' : 'suf_cpt_bylines_comments';
$show_perm = (!isset($suffusion_cpt_post_id) && !$is_cpt) ? 'suf_post_' . $format . 'show_perm' : 'suf_cpt_bylines_permalinks';
$with_title_show_perm = 'suf_post_' . $format . 'with_title_show_perm';

global $$show_cats, $$show_posted_by, $$show_tags, $$show_comment, $$show_perm, $$with_title_show_perm, $suf_cpt_bylines_post_date;
$post_show_cats = $$show_cats;
$post_show_posted_by = $$show_posted_by;
$post_show_tags = $$show_tags;
$post_show_comment = $$show_comment;
$post_show_perm = $$show_perm;
$post_with_title_show_perm = $$with_title_show_perm;
$show_date = (!isset($suffusion_cpt_post_id) && !$is_cpt) ? ($suf_date_box_show != 'hide' || ($suf_date_box_show == 'hide-search' && !is_search())) : $suf_cpt_bylines_post_date;

if ($show_date || $post_show_cats != 'hide' ||
	$post_show_posted_by != 'hide' || $post_show_tags != 'hide' || $post_show_comment != 'hide' || $post_show_perm != 'hide' || $post_with_title_show_perm != 'hide') { ?>
<div class='postdata line'>
	<?php
		$title = get_the_title();
		if (($post_show_perm && $post_show_perm != 'hide' && (isset($suffusion_cpt_post_id) || $is_cpt)) ||
				(!isset($suffusion_cpt_post_id) && !$is_cpt && $post_show_perm != 'hide' && (($title == '' || !$title) || (!($title == '' || !$title) && $post_with_title_show_perm != 'hide')))) {
			$permalink_text = apply_filters('suffusion_permalink_text', __('Permalink', 'suffusion'));
			$prepend = apply_filters('suffusion_before_byline_html', do_shortcode($suf_byline_before_permalink), 'permalink');
			$append = apply_filters('suffusion_after_byline_html', do_shortcode($suf_byline_after_permalink), 'permalink');
			echo "<span class='permalink'><span class='icon'>&nbsp;</span>".$prepend.suffusion_get_post_title_and_link($permalink_text).$append."</span>\n";
		}
	if ($show_date && $show_date !== 'hide') {
		$prepend = apply_filters('suffusion_before_byline_html', do_shortcode($suf_byline_before_date), 'date');
		$append = apply_filters('suffusion_after_byline_html', do_shortcode($suf_byline_after_date), 'date');
		echo "<span class='line-date'><span class='icon'>&nbsp;</span>".$prepend.get_the_time(get_option('date_format')).$append."</span>\n";
	}

	if ($post_show_posted_by && 'hide' != $post_show_posted_by) {
		suffusion_print_author_byline();
	}

	if ($post_show_cats != 'hide') {
		$categories = get_the_category();
		if (is_array($categories) && count($categories) > 0) {
			$prepend = apply_filters('suffusion_before_byline_html', do_shortcode($suf_byline_before_category), 'category');
			$append = apply_filters('suffusion_after_byline_html', do_shortcode($suf_byline_after_category), 'category');
			echo '<span class="category"><span class="icon">&nbsp;</span>';
			echo $prepend;
			the_category(', ');
			echo $append;
			echo '</span>';
		}
	}
	if ($post_show_tags != 'hide') {
		$tags = get_the_tags();
		if (is_array($tags) && count($tags) > 0) {
			$prepend = apply_filters('suffusion_before_byline_html', do_shortcode($suf_byline_before_tag), 'tag');
			$append = apply_filters('suffusion_after_byline_html', do_shortcode($suf_byline_after_tag), 'tag');
			echo '<span class="tags tax"><span class="icon">&nbsp;</span>';
			the_tags($prepend, ', ', $append);
			echo '</span>';
		}
	}

	if (isset($suffusion_cpt_post_id) || $is_cpt) {
		do_action('suffusion_add_taxonomy_bylines_line', $suffusion_cpt_post_id, $is_cpt);
	}

	if (is_singular() && $post_show_comment && $post_show_comment != 'hide') {
		if ('open' == $post->comment_status) {
			if (is_attachment()) {
				$mime = get_post_mime_type();
				if (strpos($mime, '/') > -1) {
					$mime = substr($mime, 0, strpos($mime, '/'));
				}
				$comments_disabled_var = "suf_{$mime}_comments";
				global $$comments_disabled_var;
				if (isset($$comments_disabled_var)) {
					$comments_disabled = $$comments_disabled_var;
					if (!$comments_disabled) {
					}
				}
				else {
?>
			<span class="comments"><span class="icon">&nbsp;</span><a href="#respond"><?php _e('Add comments', 'suffusion'); ?></a></span>
<?php
				}
			}
			else {
?>
			<span class="comments"><span class="icon">&nbsp;</span><a href="#respond"><?php _e('Add comments', 'suffusion'); ?></a></span>
<?php
			}
		}
	}
	else if ($post_show_comment && $post_show_comment != 'hide') {
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