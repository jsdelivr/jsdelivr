<?php
/**
 * This creates a widget that shows the posts of a particular category. You can use this if you are designing a site based on a magazine layout.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Category_Posts extends WP_Widget {
	var $post_excerpt_length;
	function Suffusion_Category_Posts() {
		$widget_ops = array('classname' => 'widget-suf-cat-posts',
			'description' => __("A widget to pull posts based on various selection criteria. You can use this to display posts from a category, latest posts, random posts, popular posts etc.", "suffusion"));

		$control_ops = array('width' => 810);
		$this->WP_Widget("suf-cat-posts", __("Query Posts", "suffusion"), $widget_ops, $control_ops);
	}

	function widget($args, $instance) {
		extract($args);

		$selected_category = $instance["selected_category"];
		$title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);
		$icon_type = $instance["icon_type"];
		$cat_icon_url = $instance["cat_icon_url"];
		$post_style = $instance["post_style"];
		$post_thumbnail_size = $instance['post_thumbnail_size'];
		$this->post_excerpt_length = $instance['post_excerpt_length'];
		$number_of_posts = $instance["number_of_posts"];
		$icon_height = $instance['icon_height'];
        $icon_width = $instance['icon_width'];
        $all_posts_text = $instance['all_posts_text'];
		$order = isset($instance['order']) ? $instance['order'] : 'DESC';
		$order_by = isset($instance['order_by']) ? $instance['order_by'] : 'date';
		$ignore_sticky = isset($instance['ignore_sticky']) ? $instance['ignore_sticky'] : 'ignore';
		$post_ids = isset($instance['post_ids']) ? $instance['post_ids'] : '';
		$tags = isset($instance['tags']) ? $instance['tags'] : '';
		$post_formats = isset($instance['post_formats']) ? $instance['post_formats'] : '';
		$any_post_type = isset($instance['any_post_type']) ? $instance['any_post_type'] : false;
		$separate_widgets = isset($instance['separate_widgets']) ? $instance['separate_widgets'] : false;
		$all_posts_link = isset($instance['all_posts_link']) ? $instance['all_posts_link'] : '';

		$ret = "";
        if ($icon_type == 'plugin') {
            if (function_exists('get_cat_icon')) {
                $cat_icon = get_cat_icon('echo=false&cat='.$selected_category);
                if (trim($cat_icon) != '') {
                    $ret .= "\t\t<div class='suf-cat-posts-widget-image' style='height: $icon_height;'>";
                    $ret .= $cat_icon;
                    $ret .= "</div>\n";
                }
            }
        }
        else if ($icon_type == 'custom') {
            if (trim($cat_icon_url) != '') {
                $ret .= "\t\t<div class='suf-cat-posts-widget-image' style='height: $icon_height;'>";
                $ret .= "<a href='".get_category_link($selected_category)."'>";
                $ret .= "<img src='$cat_icon_url' alt='".esc_attr($title)."' title='".esc_attr($title)."' style='width: $icon_width; height: $icon_height;'/>";
                $ret .= "</a>\n";
                $ret .= "</div>\n";
            }
        }

		$query_args = array(
			'posts_per_page' => $number_of_posts,
			'order' => $order,
			'orderby' => $order_by,
		);

		$tax_query = array(
			'relation' => 'AND',
		);
		if ($selected_category != '0' && $selected_category != 0) {
			$query_args['cat'] = $selected_category;
			$cat_tax = array(
				'taxonomy' => 'category',
				'field' => 'id',
				'terms' => array($selected_category),
				'operator' => 'IN',
			);
		}

		$post_in = array();

		if (trim($post_ids) != '') {
			$solo_posts = preg_replace('/\s\s+/', ' ', $post_ids);
			$solo_posts = explode(',', $solo_posts);
			if (count($solo_posts) > 0) {
				$post_in = $solo_posts;
			}
		}

		if ($ignore_sticky == 'ignore') {
			$query_args['ignore_sticky_posts'] = true;
		}
		else if ($ignore_sticky == 'only-sticky') {
			$post_in = get_option('sticky_posts');
		}
		else {
			$query_args['ignore_sticky_posts'] = false;
		}

		if (is_array($post_in) && count($post_in) > 0) {
			$query_args['post__in'] = $post_in;
		}

		if (trim($tags) != '') {
			$solo_tags = preg_replace('/\s\s+/', ' ', $tags);
			if (count($solo_tags) > 0) {
				$query_args['tag'] = $solo_tags;
			}
		}

		if ($post_formats != '') {
			$format_tax = array(
				'taxonomy' => 'post_format',
				'field' => 'slug',
				'terms' => array("post-format-$post_formats"),
				'operator' => 'IN',
			);
		}

		if (isset($cat_tax) && isset($format_tax)) {
			$tax_query[] = $cat_tax;
			$tax_query[] = $format_tax;

			unset($query_args['cat']);
			$query_args['tax_query'] = $tax_query;
		}
		else if (isset($cat_tax) || isset($format_tax)) {
			unset($query_args['cat']);
			$tax_query = array(isset($cat_tax) ? $cat_tax : $format_tax);
			$query_args['tax_query'] = $tax_query;
		}

		if ($any_post_type) {
			$query_args['post_type'] = 'any';
		}

		$query = new WP_query($query_args);

		if (isset($query->posts) && is_array($query->posts) && count($query->posts) > 0 && !($separate_widgets && ($post_style == 'thumbnail-full' || $post_style == 'thumbnail-excerpt'))) {
            if ($post_style == 'magazine') {
                $ret .= "<ul class='suf-cat-posts-list'>\n";
            }
			else if ($post_style == 'thumbnail' || $post_style == 'thumbnail-excerpt' || $post_style == 'thumbnail-full') {
				$ret .= "<ul class='suf-posts-thumbnail'>\n";
			}
            else {
                $ret .= "<ul>\n";
            }
			while ($query->have_posts())  {
				$query->the_post();
                if ($post_style == 'magazine') {
                    $ret .= "<li class='suf-cat-post'><a href='".get_permalink()."' class='suf-cat-post'>".get_the_title()."</a></li>\n";
                }
				else if ($post_style == 'thumbnail') {
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					$ret .= "<li class='fix'><div class='suf-widget-thumb'>".$image."</div><a href='".get_permalink()."' class='suf-widget-thumb-title'>".get_the_title()."</a></li>\n";
				}
				else if ($post_style == 'thumbnail-excerpt') {
					add_filter('excerpt_length', array(&$this, 'excerpt_length'));
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					$ret .= "<li class='fix'><div class='suf-widget-thumb'>".$image."</div><a href='".get_permalink()."' class='suf-widget-thumb-title'>".get_the_title()."</a>".suffusion_excerpt(false, false, false)."</li>\n";
				}
				else if ($post_style == 'thumbnail-full') {
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					$continue = __('Continue reading &raquo;', 'suffusion');
					$content = get_the_content($continue);
					$content = apply_filters('the_content', $content);
					$content = str_replace(']]>', ']]&gt;', $content);
					$ret .= "<li class='fix'><div class='suf-widget-thumb'>".$image."</div><a href='".get_permalink()."' class='suf-widget-thumb-title'>".get_the_title()."</a>".$content."</li>\n";
				}
				else if ($post_style == 'thumbnail-only') {
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size, 'no-link' => true));
					$ret .= "<li class='suf-widget-mosaic'><div class='suf-widget-thumb'><a href='".get_permalink()."' title=\"".esc_attr(get_the_title())."\">".$image."</a></div></li>\n";
				}
				else {
					$post_title = get_the_title();
					if (!$post_title) {
						$post_title = get_the_ID();
					}
					$ret .= "<li><a href='".get_permalink()."'>".$post_title."</a></li>\n";
				}
			}
			wp_reset_query();
			$ret .= "</ul>";
		}
		else if ($separate_widgets && ($post_style == 'thumbnail-full' || $post_style == 'thumbnail-excerpt')) {
			$original_before_widget = $before_widget;
			while ($query->have_posts())  {
				$query->the_post();
				$before_widget = preg_replace('/(?<=id=")[^"]+/','$0-'.get_the_ID(), $original_before_widget);
				echo $before_widget."\n";
				echo $before_title.get_the_title().$after_title;
				if ($post_style == 'thumbnail-full') {
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					$continue = __('Continue reading &raquo;', 'suffusion');
					$content = get_the_content($continue);
					$content = apply_filters('the_content', $content);
					$content = str_replace(']]>', ']]&gt;', $content);
					echo "<div class='suf-widget-thumb'>".$image."</div>".$content."\n";
				}
				else {
					add_filter('excerpt_length', array(&$this, 'excerpt_length'));
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					echo "<div class='suf-widget-thumb'>".$image."</div>".suffusion_excerpt(false, false, false)."\n";
				}
				echo $after_widget."\n";
			}
			wp_reset_query();
			return;
		}

        if (trim($all_posts_text)) {
            $ret .= "\t<div class='suf-mag-category-footer'>\n";
			if (trim($all_posts_link) != '') {
				$link = esc_url($all_posts_link);
			}
			else {
				$link = get_category_link($selected_category);
			}
            $ret .= "\t\t<a href='".$link."' class='suf-mag-category-all-posts'>$all_posts_text</a>";
            $ret .= "\t</div>\n";
        }

		echo $before_widget;
		if ($title != '') {
			$title = do_shortcode($title);
			echo $before_title.$title.$after_title;
		}

        echo $ret;

		echo $after_widget;
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["selected_category"] = $new_instance["selected_category"];
//		$cat = get_category($instance['selected_category']);
		$title = stripslashes(trim($new_instance["title"]));
		$instance["title"] = strip_tags($title);// == '' ? $cat->cat_name : $title;
		$instance["icon_type"] = $new_instance["icon_type"];
		$instance["post_style"] = $new_instance["post_style"];
		$instance["post_thumbnail_size"] = $new_instance["post_thumbnail_size"];
		$instance["post_excerpt_length"] = $new_instance["post_excerpt_length"];
		$instance["number_of_posts"] = $new_instance["number_of_posts"];
		$instance["icon_height"] = $new_instance["icon_height"] == '' ? '100px' : $new_instance["icon_height"];
        $instance["icon_width"] = $new_instance["icon_width"] == '' ? '100px' : $new_instance["icon_width"];
		$instance["cat_icon_url"] = strip_tags($new_instance["cat_icon_url"]);
        $instance["all_posts_text"] = stripslashes($new_instance["all_posts_text"]);
		$instance["order"] = $new_instance["order"];
		$instance["order_by"] = $new_instance["order_by"];
		$instance["ignore_sticky"] = $new_instance["ignore_sticky"];
		$instance['post_ids'] = esc_attr($new_instance['post_ids']);
		$instance['tags'] = esc_attr($new_instance['tags']);
		$instance['post_formats'] = $new_instance['post_formats'];
		$instance['any_post_type'] = $new_instance['any_post_type'];
		$instance['separate_widgets'] = $new_instance['separate_widgets'];
		$instance["all_posts_link"] = esc_url($new_instance["all_posts_link"]);

		return $instance;
	}

	function form($instance) {
		$defaults = array(
			"title" => "",
			"icon_height" => "100px",
            "icon_width" => "100px",
			"number_of_posts" => 5,
			"post_thumbnail_size" => 32,
			"post_excerpt_length" => 15,
			"ignore_sticky" => 'ignore',
			'post_ids' => '',
			'tags' => '',
			'post_formats' => '',
			'any_post_type' => false,
			'separate_widgets' => false,
		);
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<div class="suf-widget-block">
	<div class="suf-widget-3col">
<?php
		_e("<p>This widget lets you display the latest posts from a category.</p>", "suffusion");
?>

		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>" class="widefat" />
			<i><?php _e("You can use shortcodes here.", 'suffusion');?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('number_of_posts'); ?>"><?php _e('Number of posts to display:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('number_of_posts'); ?>" name="<?php echo $this->get_field_name('number_of_posts'); ?>">
<?php
		for ($i = 1; $i <= 20; $i++) {
?>
				<option <?php selected($i, $instance['number_of_posts']); ?>><?php echo $i; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('order'); ?>"><?php _e('Order:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('order'); ?>" name="<?php echo $this->get_field_name('order'); ?>" class='widefat'>
<?php
		$orders = array(
			'DESC' => __('Descending', 'suffusion'),
			'ASC' => __('Ascending', 'suffusion'),
		);
		foreach ($orders as $order => $order_text) {
?>
				<option <?php if (isset($instance['order'])) selected($order, $instance['order']); ?> value='<?php echo $order;?>'><?php echo $order_text; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('order_by'); ?>"><?php _e('Order by:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('order_by'); ?>" name="<?php echo $this->get_field_name('order_by'); ?>" class='widefat'>
<?php
		$order_bys = array(
			'date' => __('Creation date', 'suffusion'),
			'ID' => __('Post id', 'suffusion'),
			'author' => __('Post author', 'suffusion'),
			'title' => __('Post title', 'suffusion'),
			'modified' => __('Modification date', 'suffusion'),
			'comment_count' => __('Popularity (comment count)', 'suffusion'),
			'rand' => __('Random', 'suffusion'),
		);
		foreach ($order_bys as $order_by => $order_by_text) {
?>
				<option <?php if (isset($instance['order_by'])) selected($order_by, $instance['order_by']); ?> value='<?php echo $order_by;?>'><?php echo $order_by_text; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_style'); ?>"><?php _e('Post display style:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('post_style'); ?>" name="<?php echo $this->get_field_name('post_style'); ?>" class='widefat'>
		<?php
		$post_styles = array('sidebar' => __('Underline upon hover (sidebar-style)', 'suffusion'),
			'magazine' => __('Box upon hover (magazine-style)', 'suffusion'),
			'thumbnail-only' => __('Thumbnail only', 'suffusion'),
			'thumbnail' => __('Thumbnail and title', 'suffusion'),
			'thumbnail-excerpt' => __('Thumbnail, title and excerpt', 'suffusion'),
			'thumbnail-full' => __('Thumbnail, title and full post', 'suffusion'),
		);
		foreach ($post_styles as $type_id => $type_name) {
?>
				<option <?php if (isset($instance['post_style'])) selected($type_id, $instance['post_style']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_thumbnail_size'); ?>"><?php _e('Post thumbnail size (if applicable):', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('post_thumbnail_size'); ?>" name="<?php echo $this->get_field_name('post_thumbnail_size'); ?>" class='widefat'>
		<?php
		$post_thumbnail_sizes = array(
			'24' => '24px',
			'32' => '32px',
			'48' => '48px',
			'64' => '64px',
			'96' => '96px',
		);
		foreach ($post_thumbnail_sizes as $size => $size_text) {
?>
				<option <?php if (isset($instance['post_thumbnail_size'])) selected($size, $instance['post_thumbnail_size']); ?> value='<?php echo $size;?>'><?php echo $size_text; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_excerpt_length'); ?>"><?php _e('Post excerpt length (if applicable):', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('post_excerpt_length'); ?>" name="<?php echo $this->get_field_name('post_excerpt_length'); ?>" value="<?php if (isset($instance['post_excerpt_length'])) echo stripslashes($instance['post_excerpt_length']); ?>" class="widefat" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('all_posts_text'); ?>"><?php _e('Text for "All Posts":', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('all_posts_text'); ?>" name="<?php echo $this->get_field_name('all_posts_text'); ?>" value="<?php if (isset($instance['all_posts_text'])) echo stripslashes($instance['all_posts_text']); ?>" class="widefat" />
			<i><?php _e("The text you enter here will be the displayed in the button for \"All Posts\". If you leave this field blank the button will not be shown.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('all_posts_link'); ?>"><?php _e('Link for "All Posts":', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('all_posts_link'); ?>" name="<?php echo $this->get_field_name('all_posts_link'); ?>" value="<?php if (isset($instance['all_posts_link'])) echo $instance['all_posts_link']; ?>" class="widefat" />
			<i><?php _e("The text you enter here will be the linked to the \"All Posts\" button. If you leave this field blank the category page will be linked.", "suffusion"); ?></i>
		</p>
	</div>

	<div class="suf-widget-3col">
		<p>
			<label for="<?php echo $this->get_field_id('ignore_sticky'); ?>"><?php _e('Sticky Posts:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('ignore_sticky'); ?>" name="<?php echo $this->get_field_name('ignore_sticky'); ?>" class='widefat'>
<?php
		$sticky_handles = array('ignore' => __('Ignore sticky posts', 'suffusion'),
				'only-sticky' => __('Show sticky posts only (ignore the others)', 'suffusion'),
				'sticky-others' => __('Show sticky posts and other posts', 'suffusion'),
			);
		foreach ($sticky_handles as $sticky_handle => $sticky_handle_name) {
?>
				<option <?php if (isset($instance['ignore_sticky'])) selected($sticky_handle, $instance['ignore_sticky']); ?> value='<?php echo $sticky_handle;?>'><?php echo $sticky_handle_name; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('selected_category'); ?>"><?php _e('Select category to show:', 'suffusion'); ?></label>
<?php
		$cat_args = array('hierarchical' => 1,
			'name' => $this->get_field_name('selected_category'),
			'class' => 'widefat',
			'show_option_all' => __('(Any Category)', 'suffusion'),
		);
		if (isset($instance['selected_category'])) $cat_args['selected'] = $instance['selected_category'];
		wp_dropdown_categories($cat_args);
?>
			<i><?php _e("Posts from the selected category will show in the widget", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('icon_type'); ?>"><?php _e('Category Icon:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('icon_type'); ?>" name="<?php echo $this->get_field_name('icon_type'); ?>" class='widefat'>
<?php
		$icon_types = array('none' => __('No category icon', 'suffusion'),
				'plugin' => __('Use Category Icons Plugin', 'suffusion'),
				'custom' => __('Use custom image', 'suffusion'),
			);
		foreach ($icon_types as $type_id => $type_name) {
?>
				<option <?php if (isset($instance['icon_type'])) selected($type_id, $instance['icon_type']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
<?php
		}
?>
			</select>
			<i><?php _e("You can choose to display an icon for the category based on the Category Icons plugin, or a custom image", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('cat_icon_url'); ?>"><?php _e('Category icon custom image link:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('cat_icon_url'); ?>" name="<?php echo $this->get_field_name('cat_icon_url'); ?>" value="<?php if (isset($instance['cat_icon_url'])) echo $instance['cat_icon_url']; ?>" class="widefat" />
			<i><?php _e("If you have chosen to use a custom image in the previous option, please enter the complete URL of the category icon here, including http://", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('icon_height'); ?>"><?php _e('Set the height for the category icon:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('icon_height'); ?>" name="<?php echo $this->get_field_name('icon_height'); ?>"
				value="<?php echo $instance['icon_height']; ?>"/>
			<br />
			<i><?php _e("The image you have picked will be scaled to this height.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('icon_width'); ?>"><?php _e('Set the width for the category icon:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('icon_width'); ?>" name="<?php echo $this->get_field_name('icon_width'); ?>"
				value="<?php echo $instance['icon_width']; ?>"/>
			<br />
			<i><?php _e("The image you have picked will be scaled to this width.", "suffusion"); ?></i>
		</p>
	</div>

	<div class="suf-widget-3col">
		<p>
			<label for="<?php echo $this->get_field_id('tags'); ?>"><?php _e('Show posts with these tags:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('tags'); ?>" name="<?php echo $this->get_field_name('tags'); ?>" value="<?php if (isset($instance['tags'])) echo $instance['tags']; ?>" class="widefat" />
			<i><?php _e("Enter a comma-separated list of tags. Posts will be filtered by these tags.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_ids'); ?>"><?php _e('Show posts with these ids:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('post_ids'); ?>" name="<?php echo $this->get_field_name('post_ids'); ?>" value="<?php if (isset($instance['post_ids'])) echo $instance['post_ids']; ?>" class="widefat" />
			<i><?php _e("Enter a comma-separated list of post ids. Only matching posts will be shown.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_formats'); ?>"><?php _e('Post formats to include:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('post_formats'); ?>" name="<?php echo $this->get_field_name('post_formats'); ?>" class='widefat'>
<?php
		$options = array(
			'' => __('All post formats', 'suffusion'),
			'default' => __('Default', 'suffusion'),
			'aside' => __('Aside', 'suffusion'),
			'gallery' => __('Gallery', 'suffusion'),
			'link' => __('Link', 'suffusion'),
			'image' => __('Image', 'suffusion'),
			'quote' => __('Quote', 'suffusion'),
			'status' => __('Status', 'suffusion'),
			'video' => __('Video', 'suffusion'),
			'audio' => __('Audio', 'suffusion'),
			'chat' => __('Chat', 'suffusion')
		);
		foreach ($options as $option_name => $option_text) {
?>
				<option <?php if (isset($instance['post_formats'])) selected($option_name, $instance['post_formats']); ?> value='<?php echo $option_name;?>'><?php echo $option_text; ?></option>
<?php
		}
?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('any_post_type'); ?>">
				<input id="<?php echo $this->get_field_id('any_post_type'); ?>" name="<?php echo $this->get_field_name('any_post_type'); ?>" type="checkbox" <?php checked($instance['any_post_type'], 'on'); ?>  class="checkbox" />
				<?php _e('Include all post types', 'suffusion'); ?>
			</label>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('separate_widgets'); ?>">
				<input id="<?php echo $this->get_field_id('separate_widgets'); ?>" name="<?php echo $this->get_field_name('separate_widgets'); ?>" type="checkbox" <?php checked($instance['separate_widgets'], 'on'); ?>  class="checkbox" />
				<?php _e('Show each post as a separate widget (full posts only)', 'suffusion'); ?>
			</label>
		</p>
	</div>
</div>
<?php
	}

	/**
	 * Filters the length of the returned excerpt.
	 *
	 * @return int
	 */
	function excerpt_length() {
		global $suf_excerpt_custom_length;
		if (suffusion_admin_check_integer($this->post_excerpt_length)) {
			return $this->post_excerpt_length;
		}
		else if (suffusion_admin_check_integer($suf_excerpt_custom_length)) {
			return $suf_excerpt_custom_length;
		}
		else {
			return 55;
		}
	}
}
?>