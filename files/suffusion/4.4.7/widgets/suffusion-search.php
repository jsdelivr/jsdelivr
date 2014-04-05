<?php
/**
 * Defines a Search widget that overrides the default WP Search Widget.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */
class Suffusion_Search extends WP_Widget {
	function Suffusion_Search() {
		$widget_options = array(
			"classname" => "search",
			"description" => __("A search form for your blog", "suffusion"),
		);

		$control_options = array(
			"id_base" => "search"
		);

		$this->WP_Widget("search", __("Search", "suffusion"), $widget_options, $control_options);
	}

	function widget($args, $instance) {
		extract($args);

		$title = apply_filters("widget_title", $instance["title"]);
		echo $before_widget;
		if (trim($title) != "") {
			echo $before_title.$title.$after_title;
		}
		get_search_form();
		echo $after_widget;
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["title"] = strip_tags($new_instance["title"]);

		return $instance;
	}

	function form($instance) {
		$defaults = array("title" => __("Search", "suffusion"));
		$instance = wp_parse_args((array)$instance, $defaults);
?>

	<!-- Widget Title: Text Input -->
	<p>
		<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', 'suffusion'); ?></label>
		<input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" class="widefat" />
	</p>

	<?php
	}
}
?>