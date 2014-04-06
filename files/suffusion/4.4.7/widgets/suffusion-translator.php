<?php
/**
 * This widget lets people use Google Translator on your website and translate content
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Google_Translator extends WP_Widget {
	function Suffusion_Google_Translator() {
		$widget_ops = array('classname' => 'widget-suf-google-translator', 'description' => __("A widget to let people use Google Translator to translate your site", "suffusion"));
		$this->WP_Widget("suf-google-translator", __("Google Translator", "suffusion"), $widget_ops);
        $this->languages = array(
            "af" => "Afrikaans",
            "sq" => "Albanian",
            "ar" => "Arabic",
            "be" => "Belarusian",
            "bg" => "Bulgarian",
            "ca" => "Catalan",
            "zh-CN" => "Chinese (Simplified)",
            "zh-TW" => "Chinese (Traditional)",
            "hr" => "Croatian",
            "cs" => "Czech",
            "da" => "Danish",
            "nl" => "Dutch",
            "en" => "English",
            "et" => "Estonian",
            "tl" => "Filipino",
            "fi" => "Finnish",
            "fr" => "French",
            "gl" => "Galician",
            "de" => "German",
            "el" => "Greek",
            "iw" => "Hebrew",
            "hi" => "Hindi",
            "hu" => "Hungarian",
            "is" => "Icelandic",
            "id" => "Indonesian",
            "ga" => "Irish",
            "it" => "Italian",
            "ja" => "Japanese",
            "ko" => "Korean",
            "lv" => "Latvian",
            "lt" => "Lithuanian",
            "mk" => "Macedonian",
            "ms" => "Malay",
            "mt" => "Maltese",
            "no" => "Norwegian",
            "fa" => "Persian",
            "pl" => "Polish",
            "pt" => "Portuguese",
            "ro" => "Romanian",
            "ru" => "Russian",
            "sr" => "Serbian",
            "sk" => "Slovak",
            "sl" => "Slovenian",
            "es" => "Spanish",
            "sw" => "Swahili",
            "sv" => "Swedish",
            "th" => "Thai",
            "tr" => "Turkish",
            "uk" => "Ukrainian",
            "vi" => "Vietnamese",
            "cy" => "Welsh",
            "yi" => "Yiddish"
        );
	}

	function widget( $args, $instance ) {
		extract($args);
        $title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);
		$source_lang = $instance['source_lang'];

        echo $before_widget;
        if (!empty($title)) {
            echo $before_title;
            echo $title;
            echo $after_title;
        }
?>
<div id="google_translate_element"></div>
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: '<?php echo $source_lang;?>'
  }, 'google_translate_element');
}
</script>
<?php
        echo $after_widget;
    }

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["title"] = strip_tags($new_instance["title"]);
		$instance["source_lang"] = $new_instance["source_lang"];

		return $instance;
	}

	function form($instance) {
		$defaults = array("title" => __("Translate this Page", "suffusion"),
			"source_lang" => 'en',
			"show_flag" => true,
		);
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<div class="suf-widget-block">
		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>" class="widefat" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id('source_lang'); ?>"><?php _e('Source Language:', 'suffusion'); ?></label>
            <select name="<?php echo $this->get_field_name('source_lang'); ?>" id="<?php echo $this->get_field_id('source_lang'); ?>" class='widefat'>
            <?php foreach ($this->languages as $key => $lang) { ?>
                <option value="<?php echo $key; ?>" <?php if ($instance['source_lang'] == $key) { echo " selected "; } ?>><?php echo $lang; ?></option>
            <?php } ?>
            </select>
			<i><?php _e("What language is your page in?", "suffusion"); ?></i>
		</p>
</div>
<?php
	}
}
?>
