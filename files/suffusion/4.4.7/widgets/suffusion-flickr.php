<?php
/**
 * This creates a widget to display your Flickr Stream.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Flickr extends WP_Widget {
	function Suffusion_Flickr() {
		$widget_ops = array('classname' => 'widget-suf-flickr', 'description' => __("A widget to display your Flickr stream", "suffusion"));
		$control_ops = array();

		$this->WP_Widget("suf-flickr", __("Flickr", "suffusion"), $widget_ops, $control_ops);
	}

	function widget($args, $instance) {
		extract($args);
		$number = $instance['number'];
		$sorting = $instance['sorting'];
		$type = $instance['type'];
		$id = $instance['id'];
		$size = $instance['size'];
		$title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);

		echo $before_widget;

		if (!empty($title)) {
			echo $before_title;
			echo $title;
			echo $after_title;
		}
		?>
	<div class="suf-flickr-wrap fix">
		<script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?count=<?php echo $number; ?>&amp;display=<?php echo $sorting; ?>&amp;size=<?php echo $size; ?>&amp;layout=x&amp;source=<?php echo $type; ?>&amp;<?php echo $type; ?>=<?php echo $id; ?>"></script>
	</div>
	<?php
        echo $after_widget;
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;

		$instance["title"] = strip_tags($new_instance["title"]);
		$instance["id"] = strip_tags($new_instance["id"]);
		$instance["number"] = $new_instance["number"];
		$instance["sorting"] = $new_instance["sorting"];
		$instance["type"] = $new_instance["type"];
		$instance["size"] = $new_instance["size"];

		return $instance;
	}

	function form($instance) {
		$defaults = array("id" => __("your-id", "suffusion"),
			"title" => __("My Flickr Stream", "suffusion"),
			"number" => 10,
			"size" => "s",
			"sorting" => "latest",  // latest, random
			"type" => "user",   // user, group
		);
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<div class="suf-widget-block">
<?php
	_e("<p>This widget lets you display a Flickr stream.</p>", "suffusion");
?>
	<p>
		<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'suffusion'); ?></label>
		<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php if (isset($instance['title'])) echo $instance['title']; ?>" class="widefat" />
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('id'); ?>"><?php _e('Flickr ID (<a href="http://www.idgettr.com">idGettr</a>):','suffusion'); ?></label>
		<input id="<?php echo $this->get_field_id('id'); ?>" name="<?php echo $this->get_field_name('id'); ?>" value="<?php if (isset($instance['id'])) echo $instance['id']; ?>" class="widefat" />
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('number'); ?>"><?php _e('Number of pictures to display:', 'suffusion'); ?></label>
		<select id="<?php echo $this->get_field_id('number'); ?>" name="<?php echo $this->get_field_name('number'); ?>">
<?php
	for ($i = 1; $i <= 10; $i++) {
?>
			<option <?php if (isset($instance['number'])) selected($i, $instance['number']); ?>><?php echo $i; ?></option>
<?php
	}
?>
		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('size'); ?>"><?php _e('Size:', 'suffusion'); ?></label>
		<select id="<?php echo $this->get_field_id('size'); ?>" name="<?php echo $this->get_field_name('size'); ?>">
			<option value='s' <?php if (isset($instance['size'])) selected($instance['size'], 's'); ?>><?php _e('Square', 'suffusion'); ?></option>
			<option value='t' <?php if (isset($instance['size'])) selected($instance['size'], 't'); ?>><?php _e('Thumbnail', 'suffusion'); ?></option>
			<option value='m' <?php if (isset($instance['size'])) selected($instance['size'], 'm'); ?>><?php _e('Mid-Size', 'suffusion'); ?></option>
		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('sorting'); ?>"><?php _e('Image sort order:', 'suffusion'); ?></label>
		<select id="<?php echo $this->get_field_id('sorting'); ?>" name="<?php echo $this->get_field_name('sorting'); ?>">
			<option value='latest' <?php if (isset($instance['sorting'])) selected($instance['sorting'], 'latest'); ?>><?php _e('Latest', 'suffusion'); ?></option>
			<option value='random' <?php if (isset($instance['sorting'])) selected($instance['sorting'], 'random'); ?>><?php _e('Random', 'suffusion'); ?></option>
		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('type'); ?>"><?php _e('Type:', 'suffusion'); ?></label>
		<select id="<?php echo $this->get_field_id('type'); ?>" name="<?php echo $this->get_field_name('type'); ?>">
			<option value='user' <?php if (isset($instance['type'])) selected($instance['type'], 'user'); ?>><?php _e('User', 'suffusion'); ?></option>
			<option value='group' <?php if (isset($instance['type'])) selected($instance['type'], 'group'); ?>><?php _e('Group', 'suffusion'); ?></option>
		</select>
	</p>
</div>
<?php
	}
}
?>