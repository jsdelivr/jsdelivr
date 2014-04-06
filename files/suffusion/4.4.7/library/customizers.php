<?php
/**
 * Specific classes to support Theme customization
 *
 * @package Suffusion
 * @subpackage Library
 * @since 4.2.1
 */

class Suffusion_Customize_Image_Picker extends WP_Customize_Control {
	public $type = 'suffusion-image';
	private $footer_message = '';

	public function __construct($manager, $id, $args = array()) {
		$this->footer_message = isset($args['footer_message']) ? $args['footer_message'] : '';
		parent::__construct($manager, $id, $args);
	}

	public function enqueue() {
		wp_enqueue_script('suffusion-admin-customizer', get_template_directory_uri().'/admin/js/customizer.js');
		wp_enqueue_style('suffusion-admin-customizer', get_template_directory_uri().'/admin/admin-customizer.css');
	}

	public function to_json() {
		parent::to_json();
	}

	public function render_content() {
		if (empty($this->choices))
			return;

		$name = '_customize-radio-' . $this->id;

		?>
	<span class="customize-control-title"><?php echo esc_html($this->label); ?></span>
	<div class='customize-suffusion-image-picker'>
	<?php
		foreach ($this->choices as $value => $image) {
			if (isset($image['alt'])) {
				$alt = ' alt="'.esc_attr($image['alt']).'" ';
				$title = "<span class='picker-title'>".esc_attr($image['alt'])."</span><br/>";
			}
			else {
				$alt = '';
				$title = '';
			}
			?>
		<label class='customize-suffusion-picker-choice'>
			<input type="radio" value="<?php echo esc_attr($value); ?>" name="<?php echo esc_attr($name); ?>" <?php $this->link(); checked($this->value(), $value); ?> class='customize-suffusion-picker-radio'/>
			<div class='customize-suffusion-image-text'>
				<img src="<?php echo $image['src']; ?>" <?php echo $alt;?> />
				<?php echo $title; ?>
			</div>
		</label>
		<?php
		}
		?>
	</div>
		<?php
		echo $this->footer_message;
	}
}

