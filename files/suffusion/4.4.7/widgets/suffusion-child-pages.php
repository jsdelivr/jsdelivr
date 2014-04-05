<?php
/**
 * This creates a widget that shows the child pages of a given page. Results can only be displayed if you are viewing a page.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Child_Pages extends WP_Widget {
	var $post_counts, $comment_counts, $post_excerpt_length;
	function Suffusion_Child_Pages() {
		$widget_ops = array('classname' => 'widget-suf-child-pages',
			'description' => __("A widget for displaying child pages of a given page.", "suffusion"));

		$control_ops = array('width' => 650);
		$this->WP_Widget("suf-child-pages", __("Child Pages", "suffusion"), $widget_ops, $control_ops);
	}

	function widget($args, $instance) {
		if (!is_page()) {
			return;
		}

		wp_reset_query();
		global $post;
		extract($args);

		$title = $instance["title"];
		$show_if_empty = isset($instance["show_if_empty"]) ? $instance["show_if_empty"] : false;
		$order_by = $instance["order_by"];
		$order = $instance["order"];
		$include = $instance["include"];
		$exclude = $instance["exclude"];
		$parent = isset($instance["parent"]) ? $instance["parent"] : false;
		$number = $instance["number"];
		$post_style = $instance["post_style"];
		$depth = $instance["depth"];
		$post_thumbnail_size = $instance["post_thumbnail_size"];
		$post_excerpt_length = $instance["post_excerpt_length"];
		$this->post_excerpt_length = $post_excerpt_length;

		$page_args = array(
			'order_by' => $order_by,
			'order' => $order,
			'child_of' => $post->ID,
			'parent' => !$parent ? $post->ID : -1,
			'depth' => $depth,
			'title_li' => '',
			'echo' => false,
		);

		if (trim($number) != '' && suffusion_admin_check_integer(trim($number))) {
			$page_args['number'] = $number;
		}

		if (trim($include) != '') {
			$include = preg_replace('/\s\s+/', ' ', $include);
			$include = explode(',', $include);
			if (count($include) > 0) {
				$page_args['include'] = $include;
			}
		}

		if (trim($exclude) != '') {
			$exclude = preg_replace('/\s\s+/', ' ', $exclude);
			$exclude = explode(',', $exclude);
			if (count($exclude) > 0) {
				$page_args['exclude'] = $exclude;
			}
		}

		if ($post_style == 'list') {
			$pages = wp_list_pages($page_args);

			if (!$show_if_empty && trim($pages) == '') {
				return;
			}
		}
		else {
			$page_list = get_pages($page_args);
			if (!$show_if_empty && count($page_list) == 0) {
				return;
			}
		}

		echo $before_widget;
		if ($title != '') {
			$title = do_shortcode($title);
			echo $before_title.$title.$after_title;
		}

		if (isset($pages) && trim($pages) != '') {
			echo "<ul>";
			echo $pages;
			echo "</ul>";
		}
		else if (isset($page_list) && count($page_list) != 0) {
			echo "<ul class='suf-posts-thumbnail'>\n";
			foreach ($page_list as $page) {
				setup_postdata($page);
				$post = $page;
				if ($post_style == 'thumbnail') {
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					echo "<li class='fix'><div class='suf-widget-thumb'>".$image."</div><a href='".get_permalink($page->ID)."' class='suf-widget-thumb-title'>".apply_filters('the_title', $page->post_title, $page->ID)."</a></li>\n";
				}
				else if ($post_style == 'thumbnail-excerpt') {
					add_filter('excerpt_length', array(&$this, 'excerpt_length'));
					$image = suffusion_get_image(array('widget-thumb' => 'widget-'.$post_thumbnail_size));
					echo "<li class='fix'><div class='suf-widget-thumb'>".$image."</div><a href='".get_permalink($page->ID)."' class='suf-widget-thumb-title'>".apply_filters('the_title', $page->post_title, $page->ID)."</a>".suffusion_excerpt(false, false, false)."</li>\n";
				}
			}
			echo "</ul>";
		}
		echo $after_widget;
		wp_reset_query();
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["title"] = esc_attr($new_instance["title"]);
		$instance["show_if_empty"] = $new_instance["show_if_empty"];
		$instance["order_by"] = $new_instance["order_by"];
		$instance["order"] = $new_instance["order"];
		$instance["include"] = esc_attr($new_instance["include"]);
		$instance["exclude"] = esc_attr($new_instance["exclude"]);
		$instance["parent"] = $new_instance["parent"];
		$instance["number"] = esc_attr($new_instance["number"]);
		$instance["post_style"] = $new_instance["post_style"];
		$instance["depth"] = $new_instance["depth"];
		$instance["post_thumbnail_size"] = $new_instance["post_thumbnail_size"];
		$instance["post_excerpt_length"] = esc_attr($new_instance["post_excerpt_length"]);

		return $instance;
	}

	function form($instance) {
		$defaults = array(
			'title' => "[suffusion-the-post display='title']",
			'show_if_empty' => '',
			'order_by' => 'menu_order',
			'order' => 'asc',
			'include' => '',
			'exclude' => '',
			'depth' => '0',
			'parent' => 'on',
			'number' => '',
			'post_style' => 'list',
			'post_thumbnail_size' => 32,
			'post_excerpt_length' => 15
		);
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<div class="suf-widget-block">
	<div class="suf-widget-2col">
		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>" class="widefat" />
			<i><?php _e("You can use shortcodes here, such as [suffusion-the-post display='title'] to display the title of the current page.", 'suffusion');?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('show_if_empty'); ?>">
				<input type='checkbox' id="<?php echo $this->get_field_id('show_if_empty'); ?>" name="<?php echo $this->get_field_name('show_if_empty'); ?>" <?php if (isset($instance['show_if_empty'])) checked($instance['show_if_empty'], 'on'); ?>  class="checkbox" />
				<?php _e('Show empty widget if no sub-pages are found.', 'suffusion'); ?>
			</label>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('order_by'); ?>">
				<?php _e('Order by:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('order_by'); ?>" name="<?php echo $this->get_field_name('order_by'); ?>" class='widefat'>
			<?php
				$values = array(
					'post_title' => __("Post title", 'suffusion'),
					'menu_order' => __("Menu order", 'suffusion'),
					'post_date' => __("Creation time", 'suffusion'),
					'post_modified' => __("Last modification time", 'suffusion'),
					'ID' => __("Page ID", 'suffusion'),
					'post_author' => __("Post author ID", 'suffusion'),
					'post_name' => __("Post slug", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['order_by'])) selected($type_id, $instance['order_by']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('order'); ?>">
				<?php _e('Order:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('order'); ?>" name="<?php echo $this->get_field_name('order'); ?>" class='widefat'>
			<?php
				$values = array(
					'asc' => __("Ascending", 'suffusion'),
					'desc' => __("Descending", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['order'])) selected($type_id, $instance['order']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('include'); ?>"><?php _e('Include:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('include'); ?>" name="<?php echo $this->get_field_name('include'); ?>" value="<?php echo $instance['include']; ?>" class="widefat" />
			<i><?php _e("Comma-separated list of page ids. All other selection criteria are ignored.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('exclude'); ?>"><?php _e('Exclude:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('exclude'); ?>" name="<?php echo $this->get_field_name('exclude'); ?>" value="<?php echo $instance['exclude']; ?>" class="widefat" />
			<i><?php _e("Comma-separated list of page ids.", "suffusion"); ?></i>
		</p>
	</div>

	<div class="suf-widget-2col">
		<p>
			<label for="<?php echo $this->get_field_id('parent'); ?>">
				<input type='checkbox' id="<?php echo $this->get_field_id('parent'); ?>" name="<?php echo $this->get_field_name('parent'); ?>" <?php if (isset($instance['parent'])) checked($instance['parent'], 'on'); ?>  class="checkbox" />
				<?php _e('Display grandchildren.', 'suffusion'); ?>
			</label>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('number'); ?>"><?php _e('Number of sub-pages to show:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('number'); ?>" name="<?php echo $this->get_field_name('number'); ?>" value="<?php echo $instance['number']; ?>" class="widefat" />
			<i>Leave blank to display all sub-pages</i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('post_style'); ?>"><?php _e('Post display style:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('post_style'); ?>" name="<?php echo $this->get_field_name('post_style'); ?>" class='widefat'>
		<?php
		$post_styles = array(
			'list' => __('List style', 'suffusion'),
			'thumbnail' => __('Thumbnail and title', 'suffusion'),
			'thumbnail-excerpt' => __('Thumbnail, title and excerpt', 'suffusion'),
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
			<label for="<?php echo $this->get_field_id('depth'); ?>"><?php _e('Number of levels to show (only for list-style display):', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id('depth'); ?>" name="<?php echo $this->get_field_name('depth'); ?>" class='widefat'>
				<option <?php selected('0', $instance['depth']); ?> value='0'><?php _e('All child pages, displayed hierarchically', 'suffusion'); ?></option>
				<option <?php selected('-1', $instance['depth']); ?> value='-1'><?php _e('All child pages, displayed in a single list', 'suffusion'); ?></option>
	<?php
			for ($i = 1; $i <= 20; $i++) {
	?>
					<option <?php selected($i, $instance['depth']); ?>><?php echo $i; ?></option>
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
	</div>
</div>
<?php
	}

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