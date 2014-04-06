<?php
/**
 * Creates a "Featured Posts" section for your blog.
 * Depending on the criteria you set, your featured posts can be picked
 * from the "Sticky Posts", or based on a category that you define
 *
 * @package Suffusion
 * @subpackage Template
 */

global $suffusion_duplicate_posts;

function suffusion_display_featured_pager() {
	global $suf_featured_pager, $suf_featured_controller, $suf_featured_pager_alignment, $suf_featured_controller_alignment;
	$ret = "";
	if ($suf_featured_pager != 'hide' || $suf_featured_controller != 'hide') {
		$ret .= "<div id='sliderIndex' class='fix'>";
		if ($suf_featured_pager != 'hide') {
			$ret .= "<div id=\"sliderPager\" class=\"$suf_featured_pager_alignment\">";
			$ret .= "</div>";
		}
		if ($suf_featured_controller != 'hide') {
			$ret .= "<div id=\"sliderControl\" class=\"$suf_featured_controller_alignment\">";
			if ($suf_featured_controller == 'show-overlaid-icons') {
				$ret .= "\t<a class='sliderPrev' href='#' title='".esc_attr(__('Previous Post', 'suffusion'))."'>&nbsp;</a>";
				$ret .= "\t<a class='sliderPause' href='#'>". __('Pause', 'suffusion')."</a>";
				$ret .= "\t<a class='sliderNext' href='#' title='".esc_attr(__('Next Post', 'suffusion'))."'>&nbsp;</a>";
			}
			else {
				$ret .= "\t<a class='sliderPrev' href='#'>&laquo; ". __('Previous Post', 'suffusion')."</a>";
				$ret .= "\t<a class='sliderPause' href='#'>". __('Pause', 'suffusion')."</a>";
				$ret .= "\t<a class='sliderNext' href='#'>". __('Next Post', 'suffusion'). " &raquo;</a>";
			}
			$ret .= "</div>";
		}
		$ret .= "</div>";
	}
	return $ret;
}

function suffusion_display_single_featured_post($position, $excerpt_position) {
	global $suf_featured_excerpt_type, $post, $suf_featured_center_slides, $suf_featured_stretch_w;
	if (isset($suf_featured_center_slides) && $suf_featured_center_slides == 'on') {
		$center = 'center';
	}
	else {
		$center = '';
	}

	if (isset($suf_featured_stretch_w) && $suf_featured_stretch_w == 'on') {
		$full_width = 'full-width';
	}
	else {
		$full_width = '';
	}
	$ret = "<li class=\"sliderImage sliderimage-$position $center $full_width\">";
	$ret .= suffusion_get_image(array('featured' => true, 'excerpt_position' => $excerpt_position, 'default' => true));
	if ($suf_featured_excerpt_type != 'none') {
		$ret .= "<div class=\"$excerpt_position\">";
		$ret .= "<p><ins>";
		$ret .= "<a href=\"".get_permalink($post->ID)."\"  class='featured-content-title'>";
		if ($suf_featured_excerpt_type != 'excerpt') {
			$ret .= get_the_title($post->ID);
		}
		$ret .= "</a>";
		$ret .= "</ins></p>";
		if ($suf_featured_excerpt_type != 'title') {
			$ret .= suffusion_excerpt(false, false);
		}
		$ret .= "</div>";
	}
	$ret .= "</li>";
	return $ret;
}

function suffusion_display_featured_posts($echo = true) {
	global $suf_featured_allow_sticky, $suf_featured_show_latest, $suf_featured_num_posts, $suf_featured_num_latest_posts, $suf_featured_excerpt_position, $suffusion_duplicate_posts, $suf_featured_show_dupes, $suf_featured_selected_posts, $suf_featured_selected_tags, $suf_featured_pager, $suf_featured_controller, $suf_featured_pager_style;
	global $suffusion_fc_feautred_excerpt_position, $suffusion_fc_featured_post_counter, $suffusion_fc_excerpt_position, $suffusion_fc_rotation, $suffusion_fc_alt_tb, $suffusion_fc_alt_lr;
	$ret = "";

    $stickies = get_option('sticky_posts');
    $featured_categories = suffusion_get_allowed_categories('suf_featured_selected_categories');
    $featured_pages = suffusion_get_allowed_pages('suf_featured_selected_pages');
	$count_so_far = 0;
	if (is_array($stickies) && count($stickies) > 0 && $suf_featured_allow_sticky == "show") {
		$sticky_query = new WP_query(array('post__in' => $stickies));
		$count_so_far += $sticky_query->post_count;
	}

	if ($suf_featured_show_latest == 'show' && $count_so_far < $suf_featured_num_posts) {
		if (!$suf_featured_num_latest_posts) {
			$number_of_latest_posts = 5;
		}
		else {
			$number_of_latest_posts = $suf_featured_num_latest_posts;
		}
		$latest_query = new WP_query(array('post__not_in' => $stickies, 'posts_per_page' => $number_of_latest_posts, 'order' => 'DESC', 'ignore_sticky_posts' => 1));
		$count_so_far += $latest_query->post_count;
    }

	if (is_array($featured_categories) && count($featured_categories) > 0 && $count_so_far < $suf_featured_num_posts) {
		$query_cats = array();
		foreach ($featured_categories as $featured_category) {
			$query_cats[] = $featured_category->cat_ID;
		}
		$cat_query = array(
			'taxonomy' => 'category',
			'field' => 'id',
			'terms' => $query_cats,
		);
	}

	if (isset($suf_featured_selected_tags) && trim($suf_featured_selected_tags) != '' && $count_so_far < $suf_featured_num_posts) {
		$featured_tags = explode(',', trim($suf_featured_selected_tags));
		$trim_featured_tags = array();
		foreach ($featured_tags as $tag) {
			$tag = str_replace('  ', ' ', $tag);
			$trim_featured_tags[] = str_replace(' ', '-', $tag);
		}
		$tag_query = array(
			'taxonomy' => 'post_tag',
			'field' => 'slug',
			'terms' => $trim_featured_tags,
		);
	}

	if (isset($tag_query) || isset($cat_query)) {
		$cat_tag_query_args = array('post__not_in' => $stickies, 'posts_per_page' => $suf_featured_num_posts);
		if (isset($tag_query) && isset($cat_query)) {
			$cat_tag_query_args['tax_query'] = array(
				'relation' => 'OR',
				$cat_query,
				$tag_query,
			);
		}
		else if (isset($cat_query)) {
			$cat_tag_query_args['tax_query'] = array(
				$cat_query,
			);
		}
		else if (isset($tag_query)) {
			$cat_tag_query_args['tax_query'] = array(
				$tag_query,
			);
		}
	}

	if (isset($cat_tag_query_args)) {
		$cat_tag_query_args = apply_filters('suffusion_cat_tag_query_args', $cat_tag_query_args);
		$cat_tag_query = new WP_Query($cat_tag_query_args);
		$count_so_far += $cat_tag_query->post_count;
	}

	if (is_array($featured_pages) && count($featured_pages) > 0 && $count_so_far < $suf_featured_num_posts) {
        $query_pages = array();
        foreach ($featured_pages as $featured_page) {
            $query_pages[count($query_pages)] = $featured_page->ID;
        }
        $page_query = new WP_query(array('post_type' => 'page', 'post__in' => $query_pages, 'posts_per_page' => $suf_featured_num_posts, 'ignore_sticky_posts' => 1, 'orderby' => 'menu_order', 'order' => 'ASC'));
		$count_so_far += $page_query->post_count;
    }

	if (isset($suf_featured_selected_posts) && trim($suf_featured_selected_posts) != '' && $count_so_far < $suf_featured_num_posts) {
		$trim_featured_posts = str_replace(' ', '', $suf_featured_selected_posts);
		$query_posts = explode(',', $trim_featured_posts);
		$post_query = new WP_query(array('post_type' => 'post', 'post__in' => $query_posts, 'posts_per_page' => $suf_featured_num_posts, 'ignore_sticky_posts' => 1));
		$count_so_far += $post_query->post_count;
	}

	$total_count = $count_so_far;
	if ($total_count > 0) {
		$suffusion_fc_alt_tb = array("top", "bottom");
        $suffusion_fc_alt_lr = array("left", "right");
        $suffusion_fc_rotation = array("top", "bottom", "left", "right");
        if (in_array($suf_featured_excerpt_position, $suffusion_fc_rotation)) {
	        $suffusion_fc_excerpt_position = $suf_featured_excerpt_position;
        }
		$suffusion_fc_feautred_excerpt_position = 0;
		$suffusion_fc_featured_post_counter = 0;
		global $suf_featured_show_border;
		$border_class = $suf_featured_show_border == 'hide' ? 'no-border' : 'show-border';
		$index_class = ($suf_featured_pager == 'show' || $suf_featured_controller == 'show') ? 'index-below' : (($suf_featured_pager == 'show-overlaid' || $suf_featured_controller == 'show-overlaid') ? 'index-overlaid' : 'index-hidden');
		$controller_class = $suf_featured_controller == 'show-overlaid-icons' ? 'controller-icons' : '';
		$pager_class = $suf_featured_pager_style == 'numbers' ? 'pager-numbers' : 'pager-bullets';
        $ret .= "<div id=\"featured-posts\" class=\"fix $border_class $index_class $pager_class $controller_class\">";
        $ret .= "\t<div id=\"slider\" class=\"fix clear\">";
        $ret .= "\t\t<ul id=\"sliderContent\" class=\"fix clear\">";
        $do_not_duplicate = array();

        if (isset($sticky_query)) {
	        $ret .= suffusion_parse_featured_query_results($sticky_query, $do_not_duplicate);
        }
        if (isset($latest_query)) {
            $ret .= suffusion_parse_featured_query_results($latest_query, $do_not_duplicate);
        }
		if (isset($cat_tag_query)) {
			$ret .= suffusion_parse_featured_query_results($cat_tag_query, $do_not_duplicate);
		}
        if (isset($page_query)) {
	        $ret .= suffusion_parse_featured_query_results($page_query, $do_not_duplicate);
        }
        if (isset($post_query)) {
	        $ret .= suffusion_parse_featured_query_results($post_query, $do_not_duplicate);
        }

        $ret .= "\t\t</ul>";
        $ret .= "\t</div>";
        $ret .= suffusion_display_featured_pager($echo);
        $ret .= "</div>";
        if ($suf_featured_show_dupes == 'hide') {
	        $suffusion_duplicate_posts = $do_not_duplicate;
        }
	    else {
		    $suffusion_duplicate_posts = array();
	    }
    }

	if ($echo) {
		echo $ret;
	}
	return $ret;
}

function suffusion_parse_featured_query_results($query, &$do_not_duplicate) {
	global $suffusion_fc_feautred_excerpt_position, $suffusion_fc_featured_post_counter, $suf_featured_num_posts, $suf_featured_excerpt_position, $suffusion_fc_excerpt_position, $suffusion_fc_rotation, $suffusion_fc_alt_tb, $suffusion_fc_alt_lr;
    global $post;
	$ret = "";
	if (isset($query->posts) && is_array($query->posts)) {
		while ($query->have_posts())  {
			if ($suffusion_fc_featured_post_counter >= $suf_featured_num_posts) {
				break;
			}
			$query->the_post();
            if (in_array($post->ID, $do_not_duplicate)) {
                continue;
            }
            else {
	            $do_not_duplicate[] = $post->ID;
            }
			if ($suf_featured_excerpt_position == "rotate") {
				$suffusion_fc_excerpt_position = $suffusion_fc_rotation[$suffusion_fc_feautred_excerpt_position%4];
			}
			else if ($suf_featured_excerpt_position == "alttb") {
				$suffusion_fc_excerpt_position = $suffusion_fc_alt_tb[$suffusion_fc_feautred_excerpt_position%2];
			}
			else if ($suf_featured_excerpt_position == "altlr") {
				$suffusion_fc_excerpt_position = $suffusion_fc_alt_lr[$suffusion_fc_feautred_excerpt_position%2];
			}
			$suffusion_fc_feautred_excerpt_position++;
			$ret .= suffusion_display_single_featured_post($suffusion_fc_feautred_excerpt_position, $suffusion_fc_excerpt_position);
			$suffusion_fc_featured_post_counter++;
		}
	}
	return $ret;
}
?>