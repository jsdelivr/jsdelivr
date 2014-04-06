<?php
/**
 * This creates a widget that shows the users of the site. With the right parameters it can be made to show the profile for a single user, like an "About Me" widget.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Query_Users extends WP_Widget {
	var $post_counts, $comment_counts;
	function Suffusion_Query_Users() {
		$widget_ops = array('classname' => 'widget-suf-users',
			'description' => __("A widget for displaying users and their profiles.", "suffusion"));

		$control_ops = array('width' => 650);
		$this->WP_Widget("suf-users", __("Query Users", "suffusion"), $widget_ops, $control_ops);
	}

	function widget($args, $instance) {
		extract($args);

		$title = $instance["title"];
		$order_by = $instance["order_by"];
		$order = $instance["order"];
		$who = $instance["who"];
		$include = $instance["include"];
		$exclude = $instance["exclude"];
		$number_of_users = $instance["number_of_users"];
		$full_display = $instance["full_display"];
		$show_post_count = $instance["show_post_count"];
		$show_comment_count = $instance["show_comment_count"];
		$show_if_empty = isset($instance["show_if_empty"]) ? $instance["show_if_empty"] : false;

		$user_args = array(
			'order_by' => $order_by,
			'order' => $order,
			'role' => $who,
		);

		if (trim($include) != '') {
			$include = preg_replace('/\s\s+/', ' ', $include);
			$include = explode(',', $include);
			if (count($include) > 0) {
				$user_args['include'] = $include;
			}
		}

		if (trim($exclude) != '') {
			$exclude = preg_replace('/\s\s+/', ' ', $exclude);
			$exclude = explode(',', $exclude);
			if (count($exclude) > 0) {
				$user_args['exclude'] = $exclude;
			}
		}

		if ($number_of_users != 'all') {
			$user_args['number'] = $number_of_users;
		}

		$users = get_users($user_args);

		if (!$show_if_empty && count($users) == 0) {
			return;
		}

		echo $before_widget;
		if ($title != '') {
			echo $before_title.$title.$after_title;
		}

		if (count($users) > 0) {
			$user_ids = array();
			if ($show_post_count != 'none' || $show_comment_count != 'none') {
				foreach ($users as $user) {
					$user_ids[] = $user->ID;
				}
				if ($show_post_count != 'none') {
					$this->post_counts = count_many_users_posts($user_ids);
				}
				if ($show_comment_count != 'none') {
					$this->comment_counts = $this->count_many_users_comments($user_ids);
				}
			}

			if ($full_display == 'all') {
				$full_display = count($users);
			}
			else {
				$full_display = (int) $full_display;
			}

			$ret = "";
			if ($full_display > 0) {
				$ret .= "<ul class='full-display-users'>";
				$ret .= $this->get_user_list($users, 0, $full_display, 'full', $instance);
				$ret .= "</ul>";
			}

			if (count($users) > $full_display) {
				$ret .= "<ul class='gravatar-display-users'>";
				$total = count($users);
				$ret .= $this->get_user_list($users, $full_display, $total, 'gravatar', $instance);
				$ret .= "</ul>";
			}
			echo $ret;
		}
		echo $after_widget;
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["title"] = esc_attr($new_instance["title"]);
		$instance["order_by"] = $new_instance["order_by"];
		$instance["order"] = $new_instance["order"];
		$instance["who"] = $new_instance["who"];
		$instance["include"] = esc_attr($new_instance["include"]);
		$instance["exclude"] = esc_attr($new_instance["exclude"]);
		$instance["gravatar_size_full"] = $new_instance["gravatar_size_full"];
		$instance["gravatar_size_gravatar"] = $new_instance["gravatar_size_gravatar"];
		$instance["number_of_users"] = $new_instance["number_of_users"];
		$instance["full_display"] = $new_instance["full_display"];
		$instance["link_to_page"] = $new_instance["link_to_page"];
		$instance["show_bio"] = $new_instance["show_bio"];
		$instance["bio_format"] = $new_instance["bio_format"];
		$instance["custom_bio_format"] = esc_attr($new_instance["custom_bio_format"]);
		$instance["show_post_count"] = $new_instance["show_post_count"];
		$instance["show_comment_count"] = $new_instance["show_comment_count"];
		$instance["show_if_empty"] = $new_instance["show_if_empty"];

		return $instance;
	}

	function form($instance) {
		$defaults = array(
			"title" => "",
			"include" => "",
			"exclude" => "",
			"gravatar_size_full" => "64",
			"gravatar_size_gravatar" => "48",
			"number_of_users" => 'all',
			"full_display" => 0,
			"show_bio" => 'full',
			"bio_format" => 'std',
			"show_post_count" => 'both',
			"show_comment_count" => 'both',
			"show_if_empty" => '',
			"order_by" => "posts",
			"order" => "DESC",
			"who" => "",
		);
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<div class="suf-widget-block">
	<div class="suf-widget-2col">
		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>" class="widefat" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('show_if_empty'); ?>">
				<input type='checkbox' id="<?php echo $this->get_field_id('show_if_empty'); ?>" name="<?php echo $this->get_field_name('show_if_empty'); ?>" <?php if (isset($instance['show_if_empty'])) checked($instance['show_if_empty'], 'on'); ?>  class="checkbox" />
				<?php _e('Show empty widget if no users are found.', 'suffusion'); ?>
			</label>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('order_by'); ?>">
				<?php _e('Order by:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('order_by'); ?>" name="<?php echo $this->get_field_name('order_by'); ?>" class='widefat'>
			<?php
				$values = array(
					'nicename' => __("Nice name", 'suffusion'),
					'display_name' => __("Display name", 'suffusion'),
					'post_count' => __("Post count", 'suffusion'),
					'registered' => __("Joining date", 'suffusion'),
					'email' => __("Email", 'suffusion'),
					'url' => __("URL", 'suffusion'),
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
					'ASC' => __("Ascending", 'suffusion'),
					'DESC' => __("Descending", 'suffusion'),
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
			<label for="<?php echo $this->get_field_id('who'); ?>">
				<?php _e('Type of users to display:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('who'); ?>" name="<?php echo $this->get_field_name('who'); ?>" class='widefat'>
			<?php
				$values = array(
					'subscriber' => __("Subscribers", 'suffusion'),
					'contributor' => __("Contributors", 'suffusion'),
					'author' => __("Authors", 'suffusion'),
					'editor' => __("Editors", 'suffusion'),
					'administrator' => __("Administrators", 'suffusion'),
					'' => __("All users", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['who'])) selected($type_id, $instance['who']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('include'); ?>"><?php _e('Include:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('include'); ?>" name="<?php echo $this->get_field_name('include'); ?>" value="<?php echo $instance['include']; ?>" class="widefat" />
			<i><?php _e("Comma-separated list of user ids. Only matching users will be shown.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('exclude'); ?>"><?php _e('Exclude:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('exclude'); ?>" name="<?php echo $this->get_field_name('exclude'); ?>" value="<?php echo $instance['exclude']; ?>" class="widefat" />
			<i><?php _e("Comma-separated list of user ids.", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('gravatar_size_full'); ?>">
				<?php _e('Gravatar size for users displayed in full:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('gravatar_size_full'); ?>" name="<?php echo $this->get_field_name('gravatar_size_full'); ?>" class='widefat'>
			<?php
				$gravatar_sizes = array(
					'none' => __("Don't show a Gravatar", 'suffusion'),
					'24' => '24px',
					'32' => '32px',
					'48' => '48px',
					'64' => '64px',
					'96' => '96px',
				);
				foreach ($gravatar_sizes as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['gravatar_size_full'])) selected($type_id, $instance['gravatar_size_full']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('gravatar_size_gravatar'); ?>">
				<?php _e('Gravatar size for users where only the gravatar is displayed:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('gravatar_size_gravatar'); ?>" name="<?php echo $this->get_field_name('gravatar_size_gravatar'); ?>" class='widefat'>
			<?php
				$gravatar_sizes = array(
					'24' => '24px',
					'32' => '32px',
					'48' => '48px',
					'64' => '64px',
					'96' => '96px',
				);
				foreach ($gravatar_sizes as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['gravatar_size_gravatar'])) selected($type_id, $instance['gravatar_size_gravatar']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

	</div>

	<div class="suf-widget-2col">
		<p>
			<label for="<?php echo $this->get_field_id('number_of_users'); ?>">
				<?php _e('Number of users to display:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('number_of_users'); ?>" name="<?php echo $this->get_field_name('number_of_users'); ?>" class='widefat'>
				<option <?php selected('all', $instance['number_of_users']); ?> value='all'><?php _e('All users', 'suffusion'); ?></option>
	<?php
			for ($i = 1; $i <= 20; $i++) {
	?>
					<option <?php selected($i, $instance['number_of_users']); ?>><?php echo $i; ?></option>
	<?php
			}
	?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('full_display'); ?>">
				<?php _e('Number of users for whom all details will be displayed:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('full_display'); ?>" name="<?php echo $this->get_field_name('full_display'); ?>" class='widefat'>
				<option <?php selected('all', $instance['full_display']); ?> value='all'><?php _e('All users', 'suffusion'); ?></option>
	<?php
			for ($i = 0; $i <= 20; $i++) {
	?>
					<option <?php selected($i, $instance['full_display']); ?>><?php echo $i; ?></option>
	<?php
			}
	?>
			</select>
			<i><?php _e('Only Gravatars will be displayed for all other users', 'suffusion');?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('link_to_page'); ?>">
				<?php _e('Link profile to:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('link_to_page'); ?>" name="<?php echo $this->get_field_name('link_to_page'); ?>" class='widefat'>
			<?php
				$values = array(
					'none' => __("Nothing", 'suffusion'),
					'author' => __("Author page", 'suffusion'),
					'profile' => __("User profile (BuddyPress only)", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['link_to_page'])) selected($type_id, $instance['link_to_page']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('show_bio'); ?>">
				<?php _e('Show user description:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('show_bio'); ?>" name="<?php echo $this->get_field_name('show_bio'); ?>" class='widefat'>
			<?php
				$values = array(
					'none' => __("Don't show", 'suffusion'),
					'full' => __("Show for full displays", 'suffusion'),
//					'gravatar' => __("Show for Gravatar displays", 'suffusion'),
//					'both' => __("Show for both full and Gravatar displays", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['show_bio'])) selected($type_id, $instance['show_bio']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('bio_format'); ?>">
				<?php _e('User description format:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('bio_format'); ?>" name="<?php echo $this->get_field_name('bio_format'); ?>" class='widefat'>
			<?php
				$values = array(
					'std' => __("Description set in user profile", 'suffusion'),
					'custom' => __("Custom format (defined below)", 'suffusion'),
					'std+custom' => __("User profile + Custom description", 'suffusion'),
					'custom+std' => __("Custom + User description", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['bio_format'])) selected($type_id, $instance['bio_format']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('custom_bio_format'); ?>">
				<?php _e("Custom user description format (Short-codes allowed)", 'suffusion'); ?>
			</label>
			<textarea id="<?php echo $this->get_field_id('custom_bio_format'); ?>" name="<?php echo $this->get_field_name('custom_bio_format'); ?>" rows="2" cols="30"><?php if (isset($instance['custom_bio_format'])) echo $instance['custom_bio_format']; ?></textarea>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('show_post_count'); ?>">
				<?php _e('Show post count:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('show_post_count'); ?>" name="<?php echo $this->get_field_name('show_post_count'); ?>" class='widefat'>
			<?php
				$values = array(
					'none' => __("Don't show", 'suffusion'),
					'full' => __("Show for full displays", 'suffusion'),
					'gravatar' => __("Show for Gravatar displays", 'suffusion'),
					'both' => __("Show for both full and Gravatar displays", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['show_post_count'])) selected($type_id, $instance['show_post_count']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('show_comment_count'); ?>">
				<?php _e('Show comment count:', 'suffusion'); ?>
			</label>
			<select id="<?php echo $this->get_field_id('show_comment_count'); ?>" name="<?php echo $this->get_field_name('show_comment_count'); ?>" class='widefat'>
			<?php
				$values = array(
					'none' => __("Don't show", 'suffusion'),
					'full' => __("Show for full displays", 'suffusion'),
					'gravatar' => __("Show for Gravatar displays", 'suffusion'),
					'both' => __("Show for both full and Gravatar displays", 'suffusion'),
				);
				foreach ($values as $type_id => $type_name) {
			?>
					<option <?php if (isset($instance['show_comment_count'])) selected($type_id, $instance['show_comment_count']); ?> value='<?php echo $type_id;?>'><?php echo $type_name; ?></option>
			<?php
				}
			?>
			</select>
		</p>
	</div>
</div>
<?php
	}

	/**
	 * Retrieves the counts of user comments in one go. Takes an array of user ids as the parameter. This method is modeled on the
	 * standard WP function <code>count_many_users_posts</code>.
	 *
	 * @param $users
	 * @return array
	 */
	function count_many_users_comments($users) {
		global $wpdb;

		$count = array();
		if (empty($users) || ! is_array($users))
			return $count;

		$userlist = implode(',', array_map('absint', $users));
		$where = "WHERE comment_approved = 1 AND user_id in ($userlist) " ;
		$result = $wpdb->get_results("SELECT user_id, COUNT(*) FROM {$wpdb->comments} {$where} GROUP BY user_id", ARRAY_N);
		foreach ($result as $row) {
			$count[$row[0]] = $row[1];
		}
		
		
		foreach ($users as $id) {
			if (! isset($count[$id]))
				$count[$id] = 0;
		}

		return $count;
	}

	/**
	 * Displays the users returned by the widget query in the specified format.
	 *
	 * @param $users
	 * @param $start
	 * @param $finish
	 * @param $display_type
	 * @param $instance
	 * @return string
	 */
	function get_user_list($users, $start, $finish, $display_type, $instance) {
		$link_to_page = $instance["link_to_page"];
		$show_bio = $instance["show_bio"];
		$bio_format = $instance["bio_format"];
		$custom_bio_format = $instance["custom_bio_format"];
		$show_post_count = $instance["show_post_count"];
		$show_comment_count = $instance["show_comment_count"];
		$gravatar_size = $instance["gravatar_size_".$display_type];

		$ret = "";

		for ($i = $start; $i < $finish; $i++) {
			$user = $users[$i];
			$id = $user->ID;

			$ret .= "<li class='fix'>";
			$full_avatar = "";
			$display_name = get_the_author_meta('display_name', $id);
			$user_link = "";

			if ($link_to_page != 'none') {
				if (function_exists('bp_core_get_user_domain') && $link_to_page == 'profile') {
					$user_link = bp_core_get_user_domain($id);
				}
				else {
					$user_link = get_author_posts_url($id);
				}
				$full_avatar .= "<a href='$user_link' title='".esc_attr($display_name)."'>";
			}
			$avatar = get_avatar(get_the_author_meta('user_email', $id), $gravatar_size);
			$full_avatar .= $avatar;
			if ($link_to_page != 'none') {
				$full_avatar .= "</a>";
			}

			$user_details = "<div class='user-details'>";
			$title = "";

			$user_details .= "<h5>";
			if ($link_to_page != 'none' && $display_type == 'full') {
				if ($user_link != "") {
					$user_details .= "<a href='$user_link' title='".esc_attr($display_name)."'>";
				}
			}

			$user_details .= $display_name;
			$title .= $display_name;

			if ($link_to_page != 'none' && $display_type == 'full') {
				$user_details .= "</a>";
			}
			$user_details .= "</h5>";

			if ($show_bio == $display_type || $show_bio == 'both') {
				$std_format = "";
				if ($bio_format != 'custom') {
					$std_format = get_the_author_meta('description', $id);
				}
				$custom_format = "";
				if ($bio_format != 'std') {
					$custom_format = do_shortcode($custom_bio_format);
				}
				if ($bio_format == 'custom+std') {
					$user_details .= $custom_format.$std_format;
				}
				else {
					$user_details .= $std_format.$custom_format;
				}
			}

			if ($show_post_count == $display_type || $show_post_count == 'both') {
				if (isset($this->post_counts)) {
					$post_count = $this->post_counts[$id];
					if ($post_count > 1) {
						$user_details .= "<div class='user-post-count'>".sprintf(__('%1$s posts', 'suffusion'), $post_count)."</div>";
						$title .= " | ".sprintf(__('%1$s posts', 'suffusion'), $post_count);
					}
					else if ($post_count == 1) {
						$user_details .= "<div class='user-post-count'>".__('1 post', 'suffusion')."</div>";
						$title .= " | ".__('1 post', 'suffusion');
					}
				}
			}

			if ($show_comment_count == $display_type || $show_comment_count == 'both') {
				if (isset($this->comment_counts)) {
					$comment_count = $this->comment_counts[$id];
					if ($comment_count > 1) {
						$user_details .= "<div class='user-comment-count'>".sprintf(__('%1$s comments', 'suffusion'), $comment_count)."</div>";
						$title .= " | ".sprintf(__('%1$s comments', 'suffusion'), $comment_count);
					}
					else if ($comment_count == 1) {
						$user_details .= "<div class='user-comment-count'>".__('1 comment', 'suffusion')."</div>";
						$title .= " | ".__('1 comment', 'suffusion');
					}
				}
			}

			$user_details .= "</div>";
			if ($display_type == 'full') {
				$ret .= $full_avatar.$user_details;
			}
			else {
				if ($user_link != '') {
					$ret .= "<a href='$user_link' title='".esc_attr($title)."'>".$avatar."</a>";
				}
			}
			$ret .= "</li>";
		}

		return $ret;
	}
}
?>